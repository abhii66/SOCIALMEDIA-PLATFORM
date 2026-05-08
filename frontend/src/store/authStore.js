import { create } from "zustand";
import api from "../api/axiosInstance";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  // Login → POST /user-api/login
  login: async (userCred) => {
    try {
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      const res = await api.post("/user-api/login", userCred, { withCredentials: true });
      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "Your account has been blocked. Please contact support."
          : err.response?.data?.message || "Login failed";
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: msg,
      });
    }
  },

  // Logout → GET /user-api/logout
  logout: async () => {
    try {
      await api.get("/user-api/logout", { withCredentials: true });
    } catch {
      // Ignore logout errors — still clear local state
    } finally {
      set({ currentUser: null, isAuthenticated: false, error: null, loading: false });
    }
  },

  // Restore auth on page refresh → GET /user-api/check-auth
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/user-api/check-auth", { withCredentials: true });
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // 401 = not logged in, 403 = blocked — both should clear session
      if (err.response?.status === 401 || err.response?.status === 403) {
        set({ currentUser: null, isAuthenticated: false, loading: false });
        return;
      }
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },

  // Update current user data in store (after profile update)
  setCurrentUser: (user) => set({ currentUser: user }),
}));
