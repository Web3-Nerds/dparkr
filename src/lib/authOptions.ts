import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import db from "@/lib/prismaClient"

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            await db.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                avatar: user.image || "",
                walletAddress: "",
              },
            })
          }
        } catch (error) {
          console.error("Error creating user:", error)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.avatar = user.image
        token.provider = account?.provider || "google"
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.avatar = token.avatar as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
