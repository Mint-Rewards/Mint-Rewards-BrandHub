const TOKEN_KEY = 'admin_token';

export const adminAuth = {
  getToken: (): string | null =>
    localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void =>
    localStorage.setItem(TOKEN_KEY, token),

  clearToken: (): void =>
    localStorage.removeItem(TOKEN_KEY),

  isLoggedIn: (): boolean =>
    !!localStorage.getItem(TOKEN_KEY),

  authHeaders: (): HeadersInit => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
