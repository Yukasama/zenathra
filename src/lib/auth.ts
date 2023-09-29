import {
  KindeUser,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

export function getUser(): KindeUser | null {
  const { getUser } = getKindeServerSession();
  return getUser();
}
