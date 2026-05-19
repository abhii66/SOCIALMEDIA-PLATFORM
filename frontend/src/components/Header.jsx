import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import { navbarClass, navContainerClass, navBrandClass, navLinkClass, navLinkActiveClass } from "../styles/common.js";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem("theme");
    if (s) return s === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else       { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(v => !v)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] transition-colors"
    >
      {dark
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      }
    </button>
  );
}

function Header() {
  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const user            = useAuth(s => s.currentUser);
  const logout          = useAuth(s => s.logout);
  const navigate        = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const lnk = ({ isActive }) => isActive ? navLinkActiveClass : navLinkClass;

  const UserLinks = ({ onClick = () => {} }) => (
    <>
      <NavLink to="/feed"        className={lnk} onClick={onClick}>Feed</NavLink>
      <NavLink to="/explore"     className={lnk} onClick={onClick}>Explore</NavLink>
      <NavLink to="/search"      className={lnk} onClick={onClick}>Search</NavLink>
      <NavLink to="/create-post" className={lnk} onClick={onClick}>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-violet-600 dark:bg-violet-500 text-white flex items-center justify-center text-[10px] font-bold">+</span>
          Post
        </span>
      </NavLink>
      <NavLink to="/profile" className={lnk} onClick={onClick}>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-[10px] font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
          <span>Profile</span>
        </span>
      </NavLink>
    </>
  );

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        {/* Brand */}
        <NavLink to="/" className={navBrandClass}>
          <span className="inline-flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-600 dark:bg-violet-500 flex items-center justify-center text-white text-sm font-black">S</span>
            <span className="text-[#0f172a] dark:text-white">SocialApp</span>
          </span>
        </NavLink>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          <ThemeToggle />
          <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#27272a] mx-2" />
          {!isAuthenticated && (
            <>
              <NavLink to="/" end className={lnk}>Home</NavLink>
              <NavLink to="/register" className={lnk}>Register</NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive
                ? navLinkActiveClass
                : "text-sm font-semibold px-3 py-1.5 rounded-xl bg-violet-600 dark:bg-violet-500 text-white hover:bg-violet-700 transition"
              }>Sign In</NavLink>
            </>
          )}
          {isAuthenticated && !user?.isAdmin && (
            <>
              <UserLinks />
              <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#27272a] mx-1" />
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition"
              >
                Sign Out
              </button>
            </>
          )}
          {isAuthenticated && user?.isAdmin && (
            <>
              <NavLink to="/admin-profile" className={lnk}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[9px] font-bold">A</span>
                  Admin Panel
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-1.5 rounded-lg text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#27272a] transition"
            onClick={() => setOpen(v => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden bg-white dark:bg-[#09090b] border-t border-[#e2e8f0] dark:border-[#27272a] px-5 py-4 flex flex-col gap-2">
          {!isAuthenticated && (
            <>
              <NavLink to="/" end className={lnk} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/register" className={lnk} onClick={() => setOpen(false)}>Register</NavLink>
              <NavLink to="/login" className={lnk} onClick={() => setOpen(false)}>Sign In</NavLink>
            </>
          )}
          {isAuthenticated && !user?.isAdmin && <UserLinks onClick={() => setOpen(false)} />}
          {isAuthenticated && user?.isAdmin && (
            <NavLink to="/admin-profile" className={lnk} onClick={() => setOpen(false)}>Admin Panel</NavLink>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 text-left mt-2 pt-2 border-t border-[#e2e8f0] dark:border-[#27272a]"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
