import "server-only";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function createToken() {
  const token = randomUUID();
  return await bcrypt.hash(token, 10);
}
