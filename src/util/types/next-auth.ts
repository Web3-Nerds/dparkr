import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatar: string
      provider?: string;
    }
  }
  interface User {
    id: string
    email: string
    name: string
    avatar: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    provider: string
  }
}
