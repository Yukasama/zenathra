import { request } from "@/utils/request";

export async function signUp(email: string, password: string) {
  const { error } = await request("/api/users", {
    body: {
      email: email,
      password: password,
    },
    cache: false,
  });

  return { error };
}

export async function updateEmail(email: string) {
  const { error } = await request("/api/users/update-email", {
    body: {
      email: email,
    },
    cache: false,
  });

  return { error };
}

export async function updatePassword(oldPassword: string, password: string) {
  const { error } = await request("/api/users/update-password", {
    body: {
      oldPassword: oldPassword,
      password: password,
    },
    cache: false,
  });

  return { error };
}

export async function updateUsername(username: string) {
  const { error } = await request("/api/users/update-username", {
    body: {
      username: username,
    },
    cache: false,
  });

  return { error };
}
