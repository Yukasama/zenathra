import { env } from "@/env.mjs";
import { Timer } from "@/utils/helper";

interface RequestProps {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
  body?: {};
  cache?: RequestCache | boolean;
  revalidate?: number | false | undefined;
}

interface ResponseProps {
  data: any;
  error: string | null;
  status: number;
  timer: string;
}

export async function request(
  url: string,
  { method, body, cache, revalidate }: RequestProps = {}
): Promise<ResponseProps> {
  const timer = Timer();

  const reqUrl = url.startsWith("/") ? `${env.NEXT_PUBLIC_HOST}${url}` : url;

  if (cache === false) cache = "no-cache";
  else if (cache === true) cache = "default";

  const response = await fetch(reqUrl, {
    method: method || body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: revalidate },
    cache: cache || "default",
  });

  const duration = timer.ms;

  let data = null,
    error = null;

  if (!response.ok) {
    try {
      error =
        (await response.json().then((res) => res.message)) ||
        "An error occurred.";
    } catch {
      error = "An error occurred while parsing the error message.";
    }
  } else {
    try {
      data = await response.json();
    } catch {
      error = "An error occurred while parsing the response.";
    }
  }

  return { data, error, status: response.status, timer: duration };
}
