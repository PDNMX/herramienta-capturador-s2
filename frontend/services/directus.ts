import {
    authentication,
    createDirectus,
    rest,
    staticToken,
  } from "@directus/sdk"

  // URL for server-side requests (inside Docker network)
  // Falls back to NEXT_PUBLIC_BACKEND_URL for client-side or local development
  const getBackendUrl = () => {
    // Server-side: use internal URL if available
    if (typeof window === 'undefined') {
      return process.env.BACKEND_URL_INTERNAL || process.env.NEXT_PUBLIC_BACKEND_URL || ""
    }
    // Client-side: always use public URL
    return process.env.NEXT_PUBLIC_BACKEND_URL || ""
  }

  export const directus = (token: string = "") => {
    const backendUrl = getBackendUrl()
    if (token) {
      return createDirectus(backendUrl)
        .with(staticToken(token))
        .with(rest())
    }
    return createDirectus(backendUrl)
      .with(
        authentication("cookie", { credentials: "include", autoRefresh: true })
      )
      .with(rest())
  }

  export const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const backendUrl = getBackendUrl()
    const res = await fetch(
      `${backendUrl}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      }
    )
    const user = await res.json()
    if (!res.ok && user) {
      throw new Error("Datos incorrectos")
    }
    if (res.ok && user) {
      return user?.data
    }
  }
  