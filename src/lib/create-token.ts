export async function createToken() {
  const token = crypto.randomUUID();
  return await bcryptjs.hash(token, 10);
}