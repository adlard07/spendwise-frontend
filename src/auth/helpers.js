import { BASE_URL } from "@/config";

export async function fetchCsrfToken() {
  const res = await fetch(`${BASE_URL}/auth/csrf-token`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch CSRF token");
  const { csrf_token } = await res.json();
  return csrf_token;
}

export function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
