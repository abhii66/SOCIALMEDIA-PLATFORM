import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { useAuth } from "../store/authStore"

const BASE_URL = "http://localhost:2167"

const CATEGORIES = [
  "Technology", "Science", "Sports", "Entertainment",
  "Politics", "Health", "Business", "Art", "Travel", "Food", "Other"
]

// ── Icons ──────────────────────────────────
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TuneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="8" cy="6" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="16" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="10" cy="18" r="2" fill="white" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
)

// ── Reusable bits ──────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 500, color: "#999",
      textTransform: "uppercase", letterSpacing: "0.07em",
      margin: "20px 0 6px", padding: "0 4px",
    }}>
      {children}
    </p>
  )
}

function Card({ children }) {
  return (
    <div style={{
      background: "#fafafa", border: "0.5px solid #ebebeb",
      borderRadius: 16, overflow: "hidden", marginBottom: 4,
    }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: "0.5px", background: "#f0f0f0", margin: "0 16px" }} />
}

function RowButton({ icon, label, sublabel, onClick, danger }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        background: hovered ? "rgba(0,0,0,0.03)" : "transparent",
        cursor: "pointer", transition: "background 0.15s",
      }}
    >
      <div style={{ color: danger ? "#e05454" : "#555", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: danger ? "#e05454" : "#000" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontSize: 12, color: "#aaa", marginTop: 1,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {sublabel}
          </div>
        )}
      </div>
      {!danger && <div style={{ color: "#ccc", flexShrink: 0 }}><ChevronIcon /></div>}
    </div>
  )
}

// ── Change Password Sheet ──────────────────
function ChangePasswordPanel({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError("")
    if (!form.current || !form.newPass || !form.confirm) return setError("All fields are required.")
    if (form.newPass !== form.confirm) return setError("New passwords don't match.")
    if (form.newPass.length < 6) return setError("Password must be at least 6 characters.")
    setLoading(true)
    try {
      await axios.put(
        `${BASE_URL}/user-api/users/password`,
        { currentPassword: form.current, newPassword: form.newPass },
        { withCredentials: true }
      )
      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%", background: "#f5f5f5",
    border: "0.5px solid #e0e0e0", borderRadius: 10,
    padding: "11px 14px", fontSize: 15,
    outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", color: "#000",
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.25)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px 20px 0 0",
          padding: "24px 20px 40px",
          width: "100%", maxWidth: 576,
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Change Password</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input style={inputStyle} type="password" placeholder="Current password"
            value={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.value }))} />
          <input style={inputStyle} type="password" placeholder="New password"
            value={form.newPass} onChange={e => setForm(p => ({ ...p, newPass: e.target.value }))} />
          <input style={inputStyle} type="password" placeholder="Confirm new password"
            value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
        </div>

        {error && <p style={{ color: "#e05454", fontSize: 13, margin: "10px 0 0" }}>{error}</p>}
        {success && <p style={{ color: "#1a7a3a", fontSize: 13, margin: "10px 0 0" }}>Password changed successfully!</p>}

        <button
          onClick={handle}
          disabled={loading || success}
          style={{
            width: "100%", marginTop: 16, padding: "13px 0",
            background: success ? "#e6f4ed" : "#000",
            color: success ? "#1a7a3a" : "#fff",
            border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}
        >
          {loading ? "Saving..." : success ? "✓ Done" : "Update Password"}
        </button>
      </div>
    </div>
  )
}

// ── Preferences Sheet ──────────────────────
function PreferencesPanel({ onClose }) {
  const { currentUser, updatePreferences } = useAuth()
  const [selected, setSelected] = useState(currentUser?.preferredCategories ?? [])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const toggle = (cat) => {
    setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
    setSuccess(false)
  }

  const handle = async () => {
    setLoading(true)
    const ok = await updatePreferences(selected)
    if (ok) { setSuccess(true); setTimeout(onClose, 1200) }
    setLoading(false)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.25)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px 20px 0 0",
          padding: "24px 20px 40px",
          width: "100%", maxWidth: 576,
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Content Preferences</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa", lineHeight: 1 }}>×</button>
        </div>
        <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 16px" }}>
          Pick categories to prioritize in your feed. Leave empty to see everything.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {CATEGORIES.map(cat => {
            const active = selected.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                style={{
                  padding: "7px 14px", borderRadius: 20,
                  border: active ? "1.5px solid #000" : "1.5px solid #e0e0e0",
                  background: active ? "#000" : "#fff",
                  color: active ? "#fff" : "#555",
                  fontSize: 13, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <button
          onClick={handle}
          disabled={loading || success}
          style={{
            width: "100%", padding: "13px 0",
            background: success ? "#e6f4ed" : "#000",
            color: success ? "#1a7a3a" : "#fff",
            border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}
        >
          {loading ? "Saving..." : success ? "✓ Saved" : "Save Preferences"}
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────
export default function AccountSettings() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate("/")
  }

  const fullName = `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim()

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 16px", height: 54,
        display: "flex", alignItems: "center", gap: 12,
        maxWidth: 576, margin: "0 auto",
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "#000",
          cursor: "pointer", display: "flex", alignItems: "center", padding: 4,
        }}>
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Settings</span>
      </div>

      <div style={{ maxWidth: 576, margin: "0 auto", padding: "8px 16px 100px" }}>

        {/* Account info card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: 16,
          background: "#fafafa", border: "0.5px solid #ebebeb",
          borderRadius: 16, margin: "12px 0 4px",
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "#f0f0f0", flexShrink: 0,
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 600, color: "#555",
          }}>
            {currentUser?.profileImageUrl
              ? <img src={currentUser.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : fullName?.charAt(0)?.toUpperCase()
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>{fullName || "—"}</div>
            <div style={{ fontSize: 13, color: "#aaa" }}>@{currentUser?.userName}</div>
          </div>
          <div style={{ fontSize: 12, color: "#ccc", flexShrink: 0, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentUser?.email}
          </div>
        </div>

        {/* Profile section */}
        <SectionLabel>Profile</SectionLabel>
        <Card>
          <RowButton
            icon={<EditIcon />}
            label="Edit Profile"
            sublabel="Name, username, bio, photo"
            onClick={() => navigate("/editprofile")}
          />
          <Divider />
          <RowButton
            icon={<LockIcon />}
            label="Change Password"
            onClick={() => setShowPassword(true)}
          />
        </Card>

        {/* Content section */}
        <SectionLabel>Content</SectionLabel>
        <Card>
          <RowButton
            icon={<TuneIcon />}
            label="Content Preferences"
            sublabel={
              currentUser?.preferredCategories?.length > 0
                ? currentUser.preferredCategories.join(", ")
                : "Showing all categories"
            }
            onClick={() => setShowPrefs(true)}
          />
          <Divider />
          <RowButton
            icon={<BookmarkIcon />}
            label="Saved Posts"
            onClick={() => navigate("/app/savedposts")}
          />
          <Divider />
          <RowButton
            icon={<HeartIcon />}
            label="Liked Posts"
            onClick={() => navigate("/app/likedposts")}
          />
          <Divider />
          <RowButton
            icon={<TrashIcon />}
            label="Recently Deleted"
            sublabel="Posts deleted in the last 30 days"
            onClick={() => navigate("/app/recently-deleted")}
          />
        </Card>

        {/* Account section */}
        <SectionLabel>Account</SectionLabel>
        <Card>
          <RowButton
            icon={<LogoutIcon />}
            label={loggingOut ? "Logging out..." : "Log Out"}
            danger
            onClick={handleLogout}
          />
        </Card>

      </div>

      {showPassword && <ChangePasswordPanel onClose={() => setShowPassword(false)} />}
      {showPrefs && <PreferencesPanel onClose={() => setShowPrefs(false)} />}
    </div>
  )
}