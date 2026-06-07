import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const SUSPENDED_SHOP_KEY = "suspended_shop";
const ROLE_KEY = "user_role";
const SHOP_STATUS_KEY = "shop_status";

const isBrowser = () => typeof window !== "undefined";

export function saveAuth(token, user) {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  const role = user?.jenis_role || user?.role;
  const shopStatus = user?.shop?.status_verifikasi;

  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    sameSite: "lax",
  });

  if (role) {
    Cookies.set(ROLE_KEY, role, {
      expires: 1,
      sameSite: "lax",
    });
  }

  if (shopStatus) {
    Cookies.set(SHOP_STATUS_KEY, shopStatus, {
      expires: 1,
      sameSite: "lax",
    });
  }
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
  localStorage.removeItem(SUSPENDED_SHOP_KEY);
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
  Cookies.remove(SHOP_STATUS_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function saveSuspendedShop(data) {
  if (!isBrowser()) return;
  localStorage.setItem(SUSPENDED_SHOP_KEY, JSON.stringify(data || {}));
}

export function getSuspendedShop() {
  if (!isBrowser()) return null;

  try {
    const data = localStorage.getItem(SUSPENDED_SHOP_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
