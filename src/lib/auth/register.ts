import { request } from "@/utils/request";

export async function register(email: string, password: string) {
  const { error } = await request("/api/users", {
    body: {
      email: email,
      password: password,
    },
    cache: false,
  });

  return { error };
}
