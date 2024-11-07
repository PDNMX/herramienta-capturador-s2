import { NextAuthOptions, Awaitable, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { handleError } from "./utils"
import { directus, login } from "@/services/directus"
import { readMe, refresh } from "@directus/sdk"
import { JWT } from "next-auth/jwt"
import { AuthRefresh, UserSession, UserParams } from "@/types/next-auth"

const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutos en milisegundos
const REFRESH_TOKEN_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes de expirar
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 segundo
const LOGIN_STALL_TIME = parseInt(process.env.LOGIN_STALL_TIME || '500', 10);

const userParams = (user: UserSession): UserParams => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    name: `${user.first_name} ${user.last_name}`,
    entidad: user.entidad
  }
}

async function retryRefresh(token: JWT, attempts = 0): Promise<JWT> {
  try {
    const api = directus();
    const result: AuthRefresh = await api.request(
      refresh("json", token.refresh_token)
    );

    if (!result.access_token) {
      throw new Error("Invalid refresh response");
    }

    return {
      ...token,
      access_token: result.access_token,
      expires_at: Math.floor(Date.now() + ACCESS_TOKEN_TTL),
      refresh_token: result.refresh_token ?? token.refresh_token,
      error: null,
      tokenIsRefreshed: true,
    };
  } catch (error) {
    if (attempts < MAX_RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRefresh(token, attempts + 1);
    }
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async function (credentials) {
        const startTime = Date.now();
        try {
          const { email, password } = credentials as {
            email: string
            password: string
          }
          const auth = await login({ email, password })
          const apiAuth = directus(auth.access_token ?? "")
          const loggedInUser = await apiAuth.request(
            readMe({
              fields: ["id", "email", "first_name", "last_name", "entidad"],
            })
          )
          const user: Awaitable<User> = {
            id: loggedInUser.id,
            first_name: loggedInUser.first_name ?? "",
            last_name: loggedInUser.last_name ?? "",
            email: loggedInUser.email ?? "",
            entidad: loggedInUser.entidad ?? "",
            access_token: auth.access_token ?? "",
            expires: Math.floor(Date.now() + ACCESS_TOKEN_TTL),
            refresh_token: auth.refresh_token ?? "",
          }
          return user
        } catch (error: any) {
          handleError(error)
          return null
        } finally {
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < LOGIN_STALL_TIME) {
            await new Promise(resolve => setTimeout(resolve, LOGIN_STALL_TIME - elapsedTime));
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user, trigger, session }): Promise<JWT> {
      if (trigger === "update" && !session?.tokenIsRefreshed) {
        token.access_token = session.access_token
        token.refresh_token = session.refresh_token
        token.expires_at = session.expires_at
        token.tokenIsRefreshed = false
      }

      if (account) {
        return {
          access_token: user.access_token,
          expires_at: user.expires,
          refresh_token: user.refresh_token,
          user: userParams(user),
          error: null,
        }
      } else if (Date.now() + REFRESH_TOKEN_THRESHOLD > (token.expires_at ?? 0)) {
        if (!token.refresh_token) {
          return { ...token, error: "NoRefreshToken" as const };
        }

        try {
          return await retryRefresh(token);
        } catch (error : any) {
          console.error("Error refreshing token:", error);
          if (error.response && error.response.status === 401) {
            return { ...token, error: "RefreshAccessTokenError" as const, forceLogout: true };
          }
          return { ...token, error: "RefreshError" as const };
        }
      }

      return { ...token, error: null };
    },
    async session({ session, token }): Promise<Session> {
      if (token.error) {
        switch (token.error) {
          case "RefreshAccessTokenError":
          case "NoRefreshToken":
            session.forceLogout = true;
            break;
          case "RefreshError":
            session.needsRefresh = true;
            break;
        }
        session.error = token.error;
        session.expires = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toISOString()
      } else {
        const { id, name, email, entidad } = token.user as UserParams
        session.user = { id, name, email, entidad }
        session.access_token = token.access_token
        session.tokenIsRefreshed = token?.tokenIsRefreshed ?? false
        session.expires_at = token.expires_at
        session.refresh_token = token.refresh_token
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  }
}
