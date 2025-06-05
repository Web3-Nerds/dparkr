// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DparkrIDL from '../target/idl/dparkr.json'
import type { Dparkr } from 'anchor/target/types/dparkr'

// Re-export the generated IDL and type
export { Dparkr, DparkrIDL }

// The programId is imported from the program IDL.
export const DPARKR_PROGRAM_ID = new PublicKey(DparkrIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getDparkrProgram(provider: AnchorProvider, address?: PublicKey): Program<Dparkr> {
  return new Program({ ...DparkrIDL, address: address ? address.toBase58() : DparkrIDL.address } as Dparkr, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getDparkrProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return DPARKR_PROGRAM_ID
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return DPARKR_PROGRAM_ID
  }
}
