import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Dparkr } from '../target/types/dparkr'

describe('dparkr', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Dparkr as Program<Dparkr>

  const counterKeypair = Keypair.generate()

  it('Initialize Dparkr', async () => {
    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Dparkr', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Dparkr Again', async () => {
    await program.methods.increment().accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Dparkr', async () => {
    await program.methods.decrement().accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set counter value', async () => {
    await program.methods.set(42).accounts({ counter: counterKeypair.publicKey }).rpc()

    const currentCount = await program.account.counter.fetch(counterKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the counter account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        counter: counterKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.counter.fetchNullable(counterKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
