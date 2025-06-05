'use client'

import { getDparkrProgram, getDparkrProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'

export function useDparkrProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getDparkrProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getDparkrProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['dparkr', 'all', { cluster }],
    queryFn: () => program.account.dparkr.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['dparker', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ dparkr: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useDparkrProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usedparkrProgram()

  const accountQuery = useQuery({
    queryKey: ['dparkr', 'fetch', { cluster, account }],
    queryFn: () => program.account.dparkr.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['dparkr', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ dparkr: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['dparkr', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ dparkr: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['dparkr', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ dparkr: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['dparkr', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ dparkr: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
