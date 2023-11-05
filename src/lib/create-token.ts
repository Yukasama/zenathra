import "server-only";

import bcryptjs from "bcryptjs";

export async function createToken() {
  const token = crypto.randomUUID();
  return await bcryptjs.hash(token, 10);
}
