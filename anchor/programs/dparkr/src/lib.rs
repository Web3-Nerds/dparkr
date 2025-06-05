#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod dparkr {
    use super::*;

  pub fn close(_ctx: Context<CloseDparkr>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dparkr.count = ctx.accounts.dparkr.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dparkr.count = ctx.accounts.dparkr.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDparkr>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.dparkr.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDparkr<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Dparkr::INIT_SPACE,
  payer = payer
  )]
  pub dparkr: Account<'info, Dparkr>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDparkr<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub dparkr: Account<'info, Dparkr>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub dparkr: Account<'info, Dparkr>,
}

#[account]
#[derive(InitSpace)]
pub struct Dparkr {
  count: u8,
}
