// eslint-disable-next-line no-var, no-unused-vars
import type { Session, User } from "next-auth";
// eslint-disable-next-line no-var, no-unused-vars
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  // eslint-disable-next-line no-var, no-unused-vars
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

declare module "next-auth" {
  interface User extends User {
    id: UserId;
    username?: string | null;
  }

  // eslint-disable-next-line no-var, no-unused-vars
  interface Session {
    user: User;
  }
}
