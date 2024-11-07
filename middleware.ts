// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/inicio/:path*",
    "/abstenciones/:path*",
    "/faltas-administrativas/:path*",
    "/faltas-graves-particulares/:path*",
  ],
};
