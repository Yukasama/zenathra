import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;

    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = ["/sign-in", "/sign-up", "/forgot-password"];
    const userRoutes = ["/account/:path*"];
    const adminRoutes = ["/admin/:path*", "/api/admin/:path*"];

    if (isAuthPage.includes(path)) {
      if (isAuth) return NextResponse.redirect(new URL("/", req.url));
      return null;
    }

    if (
      !isAuth &&
      (adminRoutes.some((route) => path.startsWith(route)) ||
        userRoutes.some((route) => path.startsWith(route)))
    ) {
      let from = path;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (
      isAuth &&
      token.role !== "admin" &&
      adminRoutes.some((route) => path.startsWith(route))
    ) {
      let from = path;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Important to allow the request to continue if no conditions match
    return null;
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/admin/:path*",
    "/account/:path*",
  ],
};
