import { ThemeProvider } from './theme-provider'
import { ReactQueryProvider } from '@/app/react-query-provider'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import AuthProvider from './authProvider'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

export default function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = getServerSession(authOptions)

  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <AuthProvider session={session}>
          <ClusterProvider >
            <SolanaProvider>{children}</SolanaProvider>
          </ClusterProvider>
        </AuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
