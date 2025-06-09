'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { redirect } from 'next/navigation'
import { WalletButton } from '../solana/solana-provider'

export default function AccountListFeature() {
  const { publicKey } = useWallet()

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

  return (
    <section className="h-full flex items-center justify-center">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Connect your Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          To view your Solana account details and manage your assets, please connect your wallet below.
        </p>
        <div>
          <WalletButton className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-medium shadow-lg transition-all duration-300" />
        </div>
      </div>
    </section>
  )
}
