import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = "http://localhost:2167"
const RECENTS_KEY = "search_recents"
const MAX_RECENTS = 5

// ── Icons ──────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Avatar ─────────────────────────────────
function Avatar({ src, name = "", size = 72 }) {
  const [imgErr, setImgErr] = useState(false)
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  const colors = ["#e8e4ff", "#d6f5ea", "#fce4ee", "#fff0d6", "#ddeeff"]
  const textColors = ["#3C3489", "#085041", "#72243E", "#633806", "#0C447C"]
  const idx = (name.charCodeAt(0) || 0) % colors.length

  if (src && !imgErr) {
    return (
      <img src={src} alt={name} onError={() => setImgErr(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 600,
    }}>{initials}</div>
  )
}

// ── localStorage helpers ───────────────────
const getRecents = () => {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || [] }
  catch { return [] }
}

const saveRecent = (user) => {
  const prev = getRecents().filter(u => u._id !== user._id)
  const updated = [user, ...prev].slice(0, MAX_RECENTS)
  localStorage.setItem(RECENTS_KEY, JSON.stringify(updated))
  return updated
}

const removeRecent = (userId) => {
  const updated = getRecents().filter(u => u._id !== userId)
  localStorage.setItem(RECENTS_KEY, JSON.stringify(updated))
  return updated
}

const clearRecents = () => {
  localStorage.removeItem(RECENTS_KEY)
  return []
}

// ── Search Component ───────────────────────
function Search() {
  const [query, setQuery]     = useState("")
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState([])
  const [recents, setRecents] = useState(getRecents)
  const [loading, setLoading] = useState(false)
  const inputRef              = useRef(null)
  const navigate              = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const debounce = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/user-api/users/search`, {
          params: { query: query.trim() },
          withCredentials: true,
        })
        setResults(res.data.payload)
      } catch (err) {
        if (err.response?.status === 404) setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(debounce)
  }, [query])

  const clearQuery = () => { setQuery(""); setResults([]); inputRef.current?.focus() }

  const handleUserClick = (user) => {
    console.log("navigating to:", user._id, user)
    const updated = saveRecent(user)
    setRecents(updated)
    navigate(`/app/profile/${user._id}`)
  }

  const handleRemoveRecent = (userId, e) => {
    e.stopPropagation()
    setRecents(removeRecent(userId))
  }

  const handleClearAll = () => setRecents(clearRecents())

  const showRecents  = !query && focused && recents.length > 0
  const showResults  = query.trim() !== "" && results.length > 0
  const showEmpty    = query.trim() !== "" && !loading && results.length === 0
  const showIdle     = !query && !focused

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#000", minHeight: "100vh", background: "#fff",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 16px", height: 54,
        display: "flex", alignItems: "center", gap: 12,
        maxWidth: 576, margin: "0 auto",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none", border: "none",
            color: "#000", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 4,
          }}
        >
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Search </span>
        </div>
      {/* ── Search bar ── */}
      <div style={{ padding: "12px 16px 0", maxWidth: 576, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: focused ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.04)",
          border: focused ? "1px solid rgba(0,0,0,0.2)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: 14, padding: "0 14px", height: 46,
          transition: "all 0.2s",
        }}>
          <span style={{ color: focused ? "#000" : "#aaa", transition: "color 0.2s", flexShrink: 0 }}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 300)}
            placeholder="Search users"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#000", fontSize: 16, fontFamily: "inherit", caretColor: "#000",
            }}
          />
          {query.length > 0 && (
            <button onClick={clearQuery} style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(0,0,0,0.12)", border: "none", color: "#000",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ maxWidth: 576, margin: "0 auto" }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
            Searching...
          </div>
        )}

        {/* Idle state */}
        {showIdle && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, color: "#000", fontWeight: 600, margin: "0 0 6px" }}>Find people</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Search by name or username</p>
          </div>
        )}

        {/* Recent searches */}
        {showRecents && (
          <div style={{ paddingTop: 20 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0 16px", marginBottom: 8,
            }}>
              <span style={{ fontSize: 13, color: "#aaa", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Recent
              </span>
              <button onClick={handleClearAll} style={{
                fontSize: 13, color: "#aaa", background: "none",
                border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                Clear all
              </button>
            </div>
            {recents.map((user, i) => (
              <UserRow
                key={user._id} user={user} index={i}
                onUserClick={handleUserClick}
                highlightQuery=""
                trailing={
                  <button
                    onClick={e => handleRemoveRecent(user._id, e)}
                    style={{
                      background: "none", border: "none", color: "#ccc",
                      cursor: "pointer", padding: 4, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <XIcon />
                  </button>
                }
              />
            ))}
          </div>
        )}

        {/* No results */}
        {showEmpty && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, color: "#000", fontWeight: 600, margin: "0 0 6px" }}>No results for "{query}"</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Try a different name or username</p>
          </div>
        )}

        {/* Results */}
        {showResults && !loading && (
          <div style={{ paddingTop: 8 }}>
            {results.map((user, i) => (
              <UserRow
                key={user._id} user={user} index={i}
                onUserClick={handleUserClick}
                highlightQuery={query}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: #bbb; }
      `}</style>
    </div>
  )
}

// ── UserRow ────────────────────────────────
function UserRow({ user, index, onUserClick, highlightQuery, trailing }) {
  const [hovered, setHovered] = useState(false)
  const fullName = `${user.firstName} ${user.lastName}`

  const highlight = (text) => {
    if (!highlightQuery) return text
    const idx = text.toLowerCase().indexOf(highlightQuery.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: "#000", fontWeight: 700 }}>{text.slice(idx, idx + highlightQuery.length)}</span>
        {text.slice(idx + highlightQuery.length)}
      </>
    )
  }

  return (
    <div
      onClick={() => onUserClick(user)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 16px", cursor: "pointer",
        background: hovered ? "rgba(0,0,0,0.03)" : "transparent",
        transition: "background 0.15s",
        animation: `fadeUp 0.3s ease ${index * 40}ms both`,
      }}
    >
      <Avatar src={user.profileImageUrl} name={fullName} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#000", lineHeight: 1.3 }}>
          {highlight(fullName)}
        </div>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4 }}>
          @{highlight(user.userName)}
        </div>
      </div>
      {trailing ?? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#ccc", flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

export default Search