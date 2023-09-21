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

    if (authRoutes.includes(path)) {
      if (isAuth) return NextResponse.redirect(new URL("/", req.url));
      return null;
    }

    if (
      !isAuth &&
      (adminRoutes.some((route) => route.test(path)) ||
        userRoutes.includes(path))
    ) {
      let from = path;
      if (req.nextUrl.search) from += req.nextUrl.search;

      return NextResponse.redirect(
        new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
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
