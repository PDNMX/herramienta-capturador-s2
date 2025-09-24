import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Directus",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call Directus authentication endpoint - force correct URL
          const backendUrl = 'http://127.0.0.1:8057'
          console.log('Attempting to authenticate with backend:', backendUrl)
          console.log('Environment var NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
          console.log('All environment vars:', Object.keys(process.env).filter(k => k.includes('BACKEND')))

          const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()

          if (data?.data?.access_token) {
            // Get user info with the token
            const userResponse = await fetch(`${backendUrl}/users/me`, {
              headers: {
                'Authorization': `Bearer ${data.data.access_token}`,
              },
            })

            if (userResponse.ok) {
              const userData = await userResponse.json()

              // Get role information
              let roleName = userData.data.role
              if (userData.data.role) {
                const roleResponse = await fetch(`${backendUrl}/roles/${userData.data.role}`, {
                  headers: {
                    'Authorization': `Bearer ${data.data.access_token}`,
                  },
                })

                if (roleResponse.ok) {
                  const roleData = await roleResponse.json()
                  roleName = roleData.data.name || userData.data.role
                }
              }

              return {
                id: userData.data.id,
                email: userData.data.email,
                first_name: userData.data.first_name,
                last_name: userData.data.last_name,
                role: roleName,
                avatar: userData.data.avatar,
                access_token: data.data.access_token,
              }
            }
          }

          return null
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.first_name = user.first_name
        token.last_name = user.last_name
        token.access_token = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.first_name = token.first_name as string
        session.user.last_name = token.last_name as string
        session.access_token = token.access_token as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url === baseUrl + "/login" || url === baseUrl) {
        return baseUrl + "/dashboard"
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut({ session }) {
      console.log(`User ${session?.user?.email} signed out`)
    },
  },
}