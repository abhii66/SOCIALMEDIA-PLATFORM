import { useNavigate } from 'react-router-dom'

// ── Icons ──────────────────────────────────
const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 192 192" fill="none">
    <path d="M141.537 88.988C140.31 88.388 139.051 87.823 137.763 87.296C135.327 60.525 120.061 45.393 96.27 45.245C96.183 45.244 96.096 45.244 96.009 45.244C81.771 45.244 69.787 51.565 62.099 62.834L75.916 72.47C81.576 64.183 90.461 59.77 96.009 59.77C108.126 59.848 117.245 67.07 120.76 79.015C118.208 78.604 115.564 78.38 112.842 78.38C88.52 78.38 71.972 92.73 71.972 114.147C71.972 136.113 89.085 149.5 112.842 149.5C140.193 149.5 156.372 133.208 156.372 108.007C156.372 99.516 154.264 92.107 141.537 88.988ZM112.842 135.068C98.721 135.068 86.399 128.014 86.399 114.147C86.399 100.835 97.647 92.807 112.842 92.807C127.678 92.807 138.622 99.747 138.622 114.147C138.622 128.546 127.306 135.068 112.842 135.068Z" fill="currentColor"/>
    <path d="M96 192C148.975 192 192 148.975 192 96C192 43.025 148.975 0 96 0C43.025 0 0 43.025 0 96C0 148.975 43.025 192 96 192ZM96 15C140.735 15 177 51.265 177 96C177 140.735 140.735 177 96 177C51.265 177 15 140.735 15 96C15 51.265 51.265 15 96 15Z" fill="currentColor"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.8" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
    <rect width="20" height="2.2" rx="1.1" fill="currentColor" />
    <rect y="6.9" width="13" height="2.2" rx="1.1" fill="currentColor" />
    <rect y="13.8" width="20" height="2.2" rx="1.1" fill="currentColor" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
    />
  </svg>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

// ── Constants ──────────────────────────────
const NAV_TABS = ["ForYou", "Following"]

const MENU_ITEMS = [
  { label: "Saved",       Icon: BookmarkIcon, color: "#333"    },
  { label: "Liked posts", Icon: HeartIcon,    color: "#333"    },
  // { label: "Settings",    Icon: SettingsIcon, color: "#333"    },
  { label: "Log out",     Icon: LogoutIcon,   color: "#e05454" },
]

const iconBtnBase = {
  width: 40, height: 40,
  display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  color: "#888",
  cursor: "pointer",
  transition: "all 0.2s",
  fontFamily: "inherit",
  flexShrink: 0,
}

// ── Header ─────────────────────────────────
function Header({
  activeTab = "For You",
  onTabChange = () => {},
  onMenuOpen = () => {},
  menuOpen = false,
}) {
  const navigate = useNavigate()

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            maxWidth: 576,
            margin: "0 auto",
            padding: "0 16px",
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Hamburger / Close */}
          <button
            onClick={onMenuOpen}
            style={{ ...iconBtnBase, color: menuOpen ? "#000" : "#888" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#000" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = menuOpen ? "#000" : "#888" }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {/* Logo */}
          <div
            className="logo-float"
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", color: "#000", display: "flex", alignItems: "center" }}
          >
            <Logo />
          </div>

          {/* Search */}
          <button
            onClick={() => navigate('/search')}
            style={{ ...iconBtnBase, color: "#888" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#000" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888" }}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>

        {/* ── Feed tabs ── */}
        <div style={{ maxWidth: 576, margin: "0 auto", display: "flex" }}>
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => {onTabChange(tab)
                    navigate(tab === "ForYou" ? "/app/foryou" : "/app/following")
                }}
                style={{
                  flex: 1, paddingTop: 8, paddingBottom: 0,
                  fontSize: 14, fontWeight: 500,
                  background: "none", border: "none", cursor: "pointer",
                  color: isActive ? "#000" : "#aaa",
                  transition: "color 0.2s", fontFamily: "inherit",
                }}
              >
                {tab}
                <div style={{
                  height: 2,
                  background: isActive ? "#000" : "transparent",
                  borderRadius: 2, marginTop: 10,
                  transition: "background 0.2s",
                }} />
              </button>
            )
          })}
        </div>
      </header>

      {/* ── Slide-down menu ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={onMenuOpen}
            style={{
              position: "fixed", inset: 0, zIndex: 38,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0,
              zIndex: 39,
              background: "#fff",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
              animation: "slideDown 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div style={{ maxWidth: 576, margin: "0 auto" }}>
              <div style={{ height: 98 }} />

              {/* Profile peek */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 20px",
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.03)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0,
                }}>
                  Y
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000", lineHeight: 1.3 }}>you</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.4 }}>View profile →</div>
                </div>
              </div>

              {/* Menu items with icons */}
              {MENU_ITEMS.map(({ label, Icon, color }, i) => (
                <div
                  key={label}
                     onClick={() => {
      if (label === "Saved")       navigate("/app/savedposts")
      if (label === "Liked posts") navigate("/app/likedposts")
      if (label === "Log out")     navigate("/")
      onMenuOpen()   // ← closes the drawer after clicking
    }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                    fontSize: 14, fontWeight: 500,
                    color: color,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    animation: `slideDown 0.32s cubic-bezier(0.16,1,0.3,1) ${(i + 1) * 35}ms both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.03)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                >
                  <Icon />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-3px); }
        }
        .logo-float { animation: floatLogo 4s ease-in-out infinite; }
      `}</style>
    </>
  )
}

export default Header