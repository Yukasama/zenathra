import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;

    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = path.startsWith("/auth/");
    const userRoutes = ["/account/:path*"];
    const adminRoutes = ["/admin/:path*", "/api/admin/:path*"];

    if (isAuthPage) {
      if (isAuth) return NextResponse.redirect(new URL("/", req.url));
      return null;
    }

    if (
      !isAuth &&
      (adminRoutes.some((routes) => path.startsWith(routes)) ||
        userRoutes.some((routes) => path.startsWith(routes)))
    ) {
      let from = path;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (
      isAuth &&
      token.role !== "admin" &&
      adminRoutes.some((routes) => path.startsWith(routes))
    ) {
      let from = path;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
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
  matcher: ["/auth/:path*", "/admin/:path*", "/account/:path*"],
};
