const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const AuthService = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("authChange"));
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("authChange"));
  },
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/login";
  },
  isAuthenticated() {
    return !!this.getToken();
  },
};