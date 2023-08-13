import { request } from "@/utils/request";

export async function sendMail(
  email: string,
  subject: string,
  message: string
) {
  const { error } = await request("/api/users/sendMail", {
    body: {
      email: email,
      subject: subject,
      message: message,
    },
    cache: false,
  });
  return { error };
}
