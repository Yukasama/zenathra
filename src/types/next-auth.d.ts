// eslint-disable-next-line no-var, no-unused-vars
import type { Session, User } from "next-auth";
// eslint-disable-next-line no-var, no-unused-vars
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  // eslint-disable-next-line no-var, no-unused-vars
  interface JWT {
    id: string;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface User extends User {
    id: string;
    username?: string | null;
  }

  // eslint-disable-next-line no-var, no-unused-vars
  interface Session {
    user: User;
  }
}
