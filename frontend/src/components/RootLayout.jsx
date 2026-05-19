import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";

function RootLayout() {
  const checkAuth = useAuth(s => s.checkAuth);
  const loading   = useAuth(s => s.loading);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0d]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#a1a1aa]">Loading…</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fafaf9] dark:bg-[#0c0c0d] min-h-screen transition-colors duration-300">
      <Header />
      <div className="min-h-screen max-w-4xl mx-auto px-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
