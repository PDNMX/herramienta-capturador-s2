import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      first_name: string
      last_name: string
      role: string
      avatar?: string
    }
  }

  interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
    avatar?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    first_name: string
    last_name: string
  }
}