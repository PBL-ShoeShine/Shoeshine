import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const isBrowser = () => typeof window !== "undefined";

export function saveAuth(token, user) {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    sameSite: "lax",
  });
}

export function getToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (!isBrowser()) return null;

  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
