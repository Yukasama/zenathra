export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/admin/:path*",
    "/settings/:path*",
    "/portfolio",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
