import { request } from "@/utils/request";

export async function sendVerificationMail(
  email: string,
  subject: string,
  message: string
) {
  const { error } = await request("/api/users/send-verification-mail", {
    body: {
      email: email,
      subject: subject,
      message: message,
    },
    cache: false,
  });
  return { error };
}
