import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply saved theme on first paint
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (loading) {
    return (
      <p className="text-center text-sm text-[#a1a1a6] dark:text-[#6e6e73] py-20 animate-pulse">
        Loading...
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f0f0f] min-h-screen transition-colors duration-300">
      <Header />
      <div className="min-h-screen mx-auto max-w-5xl px-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
