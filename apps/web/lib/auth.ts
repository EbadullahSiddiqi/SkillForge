const TOKEN_KEY = "skillforge_token";

export function setToken(token: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  removeToken();

  window.location.href = "/login";
}
