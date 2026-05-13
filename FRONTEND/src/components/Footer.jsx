import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../store/authStore.js'

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="1" y="1" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.8" />
    <line x1="11" y1="6" x2="11" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const UserIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HomeIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled
      ? <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill="currentColor" />
      : <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />}
  </svg>
)

const FOOTER_TABS = [
  { key: "home",    Icon: HomeIcon, path: "/app/foryou" },
  { key: "compose", Icon: PlusIcon, path: "/app/postsupload" },
  { key: "profile", Icon: UserIcon, path: "/app/profile" },
]

function Footer() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const activeNav = FOOTER_TABS.find(t => location.pathname.startsWith(t.path))?.key || "home"

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 40,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 576,
          margin: "0 auto",
          padding: "0 8px",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {FOOTER_TABS.map(({ key, Icon, path }) => {
          const isActive  = activeNav === key
          const isCompose = key === "compose"

          return (
            <button
              key={key}
                onClick={() => {if (key === "profile") { navigate(`/app/profile/${user?._id}`)} 
                else {
                  navigate(path)
                }
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 56, height: 56,
                borderRadius: 16,
                border: isCompose ? "1.5px solid rgba(0,0,0,0.15)" : "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: isCompose ? "rgba(0,0,0,0.06)" : "transparent",
                color: isCompose ? "#000" : isActive ? "#000" : "#bbb",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isCompose
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(0,0,0,0.05)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isCompose
                  ? "rgba(0,0,0,0.06)"
                  : "transparent"
              }}
              aria-label={key}
            >
              <Icon filled={isActive && !isCompose} />
            </button>
          )
        })}
      </div>
    </footer>
  )
}

export default Footer