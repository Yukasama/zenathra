import { User } from "@/types/user";
import { request } from "@/utils/request";

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await request(`/api/users/${userId}`);

  if (error) return null;
  return data;
}

export async function getAllUsers(): Promise<User[] | null> {
  const { data, error } = await request("/api/users/getAll");

  if (error) return null;
  return data;
}
