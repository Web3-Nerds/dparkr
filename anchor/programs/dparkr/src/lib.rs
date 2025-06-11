use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod dparkr {
    use super::*;

    pub fn book_parking(ctx: Context<BookParking>, nonce: u8, amount: u64) -> Result<()> {
        require!(amount > 0, ParkingError::InvalidAmount);

        let booking = &mut ctx.accounts.dparkr;
        booking.driver = ctx.accounts.driver.key();
        booking.owner = ctx.accounts.owner.key();
        booking.amount = amount;
        booking.nonce = nonce;
        booking.status = BookingStatus::Pending as u8;
        booking.timestamp = Clock::get()?.unix_timestamp;

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.driver.key(),
            &ctx.accounts.dparkr.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.driver.to_account_info(),
                ctx.accounts.dparkr.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn cancel_booking(ctx: Context<CancelBooking>) -> Result<()> {
        let booking = &mut ctx.accounts.dparkr;
        
        let signer_key = ctx.accounts.signer.key();
        let is_driver = signer_key == booking.driver;
        let is_owner = signer_key == booking.owner;
        
        require!(
            is_driver || is_owner,
            ParkingError::Unauthorized
        );
        
        require!(
            booking.status == BookingStatus::Pending as u8,
            ParkingError::InvalidState
        );

        let amount = booking.amount;
        
        let dparkr_lamports = ctx.accounts.dparkr.to_account_info().lamports();
        let driver_lamports = ctx.accounts.driver_account.to_account_info().lamports();
        
        require!(dparkr_lamports >= amount, ParkingError::InsufficientFunds);
        
        **ctx.accounts.dparkr.to_account_info().try_borrow_mut_lamports()? = 
            dparkr_lamports.checked_sub(amount).ok_or(ParkingError::ArithmeticOverflow)?;
        **ctx.accounts.driver_account.to_account_info().try_borrow_mut_lamports()? = 
            driver_lamports.checked_add(amount).ok_or(ParkingError::ArithmeticOverflow)?;

        booking.status = BookingStatus::Cancelled as u8;

        Ok(())
    }

    pub fn confirm_booking(ctx: Context<ConfirmBooking>) -> Result<()> {
        let booking = &mut ctx.accounts.dparkr;
        require_keys_eq!(ctx.accounts.owner.key(), booking.owner, ParkingError::Unauthorized);
        require!(
            booking.status == BookingStatus::Pending as u8,
            ParkingError::InvalidState
        );

        let total = booking.amount;
        let platform_fee = total.checked_mul(2).ok_or(ParkingError::ArithmeticOverflow)?
            .checked_div(100).ok_or(ParkingError::ArithmeticOverflow)?;
        let owner_amount = total.checked_sub(platform_fee).ok_or(ParkingError::ArithmeticOverflow)?;

        let dparkr_lamports = ctx.accounts.dparkr.to_account_info().lamports();
        let owner_lamports = ctx.accounts.owner.to_account_info().lamports();
        let platform_lamports = ctx.accounts.platform_wallet.to_account_info().lamports();

        require!(dparkr_lamports >= total, ParkingError::InsufficientFunds);

        **ctx.accounts.dparkr.to_account_info().try_borrow_mut_lamports()? = 
            dparkr_lamports.checked_sub(owner_amount).ok_or(ParkingError::ArithmeticOverflow)?;
        **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? = 
            owner_lamports.checked_add(owner_amount).ok_or(ParkingError::ArithmeticOverflow)?;

        if platform_fee > 0 {
            let remaining_lamports = ctx.accounts.dparkr.to_account_info().lamports();
            **ctx.accounts.dparkr.to_account_info().try_borrow_mut_lamports()? = 
                remaining_lamports.checked_sub(platform_fee).ok_or(ParkingError::ArithmeticOverflow)?;
            **ctx.accounts.platform_wallet.to_account_info().try_borrow_mut_lamports()? = 
                platform_lamports.checked_add(platform_fee).ok_or(ParkingError::ArithmeticOverflow)?;
        }

        booking.status = BookingStatus::Confirmed as u8;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(nonce: u8, amount: u64)]
pub struct BookParking<'info> {
    #[account(mut)]
    pub driver: Signer<'info>,

    pub owner: UncheckedAccount<'info>,

    #[account(
        init,
        seeds = [b"dparkr", driver.key().as_ref(), &[nonce]],
        bump,
        payer = driver,
        space = 8 + Dparkr::INIT_SPACE
    )]
    pub dparkr: Account<'info, Dparkr>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelBooking<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        constraint = driver_account.key() == dparkr.driver @ ParkingError::Unauthorized
    )]
    pub driver_account: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"dparkr", dparkr.driver.as_ref(), &[dparkr.nonce]],
        bump,
        close = driver_account
    )]
    pub dparkr: Account<'info, Dparkr>,
}

#[derive(Accounts)]
pub struct ConfirmBooking<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = driver_account_info.key() == dparkr.driver @ ParkingError::Unauthorized
    )]
    pub driver_account_info: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"dparkr", dparkr.driver.as_ref(), &[dparkr.nonce]],
        bump,
        has_one = owner,
        close = driver_account_info
    )]
    pub dparkr: Account<'info, Dparkr>,

    #[account(mut)]
    pub platform_wallet: SystemAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Dparkr {
    pub driver: Pubkey,     
    pub owner: Pubkey,     
    pub amount: u64,      
    pub nonce: u8,       
    pub status: u8,     
    pub timestamp: i64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BookingStatus {
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
}

#[error_code]
pub enum ParkingError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Invalid amount; must be > 0.")]
    InvalidAmount,
    #[msg("Invalid state for this operation.")]
    InvalidState,
    #[msg("Insufficient funds in escrow account.")]
    InsufficientFunds,
    #[msg("Arithmetic overflow occurred.")]
    ArithmeticOverflow,
}
