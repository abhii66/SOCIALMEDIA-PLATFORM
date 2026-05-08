import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common.js";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="w-8 h-8 flex items-center justify-center rounded-full text-[#6e6e73] dark:text-[#98989d] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        // Sun icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
      ) : (
        // Moon icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const linkCls = ({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass);

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* Logo */}
        <NavLink to="/" className={navBrandClass} onClick={() => setMenuOpen(false)}>
          SocialApp
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-6">
          <li><ThemeToggle /></li>

          {!isAuthenticated && (
            <>
              <li><NavLink to="/" end className={linkCls}>Home</NavLink></li>
              <li><NavLink to="/register" className={linkCls}>Register</NavLink></li>
              <li><NavLink to="/login" className={linkCls}>Login</NavLink></li>
            </>
          )}

          {isAuthenticated && !user?.isAdmin && (
            <>
              <li><NavLink to="/feed" className={linkCls}>Feed</NavLink></li>
              <li><NavLink to="/explore" className={linkCls}>Explore</NavLink></li>
              <li><NavLink to="/search" className={linkCls}>Search</NavLink></li>
              <li><NavLink to="/create-post" className={linkCls}>+ Post</NavLink></li>
              <li><NavLink to="/profile" className={linkCls}>Profile</NavLink></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#ff3b30] hover:text-[#d62c23] font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {isAuthenticated && user?.isAdmin && (
            <>
              <li><NavLink to="/admin-profile" className={linkCls}>Admin Panel</NavLink></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#ff3b30] hover:text-[#d62c23] font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile right: theme toggle + hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-[#1d1d1f] dark:text-white p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#0f0f0f] border-t border-[#e8e8ed] dark:border-[#38383a] px-6 py-4 flex flex-col gap-4">
          {!isAuthenticated && (
            <>
              <NavLink to="/" end className={linkCls} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/register" className={linkCls} onClick={() => setMenuOpen(false)}>Register</NavLink>
              <NavLink to="/login" className={linkCls} onClick={() => setMenuOpen(false)}>Login</NavLink>
            </>
          )}
          {isAuthenticated && !user?.isAdmin && (
            <>
              <NavLink to="/feed" className={linkCls} onClick={() => setMenuOpen(false)}>Feed</NavLink>
              <NavLink to="/explore" className={linkCls} onClick={() => setMenuOpen(false)}>Explore</NavLink>
              <NavLink to="/search" className={linkCls} onClick={() => setMenuOpen(false)}>Search</NavLink>
              <NavLink to="/create-post" className={linkCls} onClick={() => setMenuOpen(false)}>+ Post</NavLink>
              <NavLink to="/profile" className={linkCls} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="text-sm text-[#ff3b30] font-medium text-left">Logout</button>
            </>
          )}
          {isAuthenticated && user?.isAdmin && (
            <>
              <NavLink to="/admin-profile" className={linkCls} onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
              <button onClick={handleLogout} className="text-sm text-[#ff3b30] font-medium text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
