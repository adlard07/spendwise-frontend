import axios from "axios";
import { BASE_URL } from "@/config";
import { fetchCsrfToken, getCsrfTokenFromCookie } from "@/auth/helpers";

export async function initCsrf() {
  await fetchCsrfToken();
}

export async function login(form) {
  const csrf = getCsrfTokenFromCookie();

  const { data } = await axios.post(
    `${BASE_URL}/auth/login`,
    { email: form.email, password: form.password },
    {
      headers: { "X-CSRF-Token": csrf },
      withCredentials: true,
    },
  );

  return data;
}

export async function signup(form) {
  const csrf = getCsrfTokenFromCookie();

  const { data } = await axios.post(
    `${BASE_URL}/auth/signup`,
    { name: form.name, email: form.email, password: form.password },
    {
      withCredentials: true,
      headers: { "X-CSRF-Token": csrf },
    },
  );

  return data;
}

export async function logout() {
  await axios.post(
    "/api/logout",
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );
}
