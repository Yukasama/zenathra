import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = await getToken({ req });
    const isAuth = !!token;

    const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
    const userRoutes = ["/u/portfolio", "/u/settings"];
    const adminRoutes = [/^\/admin(\/.*)?$/, /^\/api\/admin(\/.*)?$/];

    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      style-src 'self' 'nonce-${nonce}';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set(
      "Content-Security-Policy",
      // Replace newline characters and spaces
      cspHeader.replace(/\s{2,}/g, " ").trim()
    );

    if (authRoutes.includes(path)) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next({
        headers: requestHeaders,
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (
      !isAuth &&
      (adminRoutes.some((route) => route.test(path)) ||
        userRoutes.includes(path))
    ) {
      let from = path;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next({
      headers: requestHeaders,
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: async () => true,
    },
  }
);

export const config = {
  matcher: [
    "/portfolio",
    "/settings/:path*",
    "/auth-callback",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
