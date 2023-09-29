import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: ["/u/portfolio", "/u/settings"],
};

export default authMiddleware;
