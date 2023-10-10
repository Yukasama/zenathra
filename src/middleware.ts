import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: [
    "/portfolio",
    "/settings/:path*",
    "/dashboard/:path*",
    "/auth-callback",
  ],
};

export default authMiddleware;
