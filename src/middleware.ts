import NextAuth from "next-auth";
import { authConfig } from "./lib/auth";

export default NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
