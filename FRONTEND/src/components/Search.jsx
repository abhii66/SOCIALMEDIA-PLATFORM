import { useState, useRef, useEffect } from 'react'

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

// ── Mock data ──────────────────────────────
const MOCK_USERS = [
  { id: 1, handle: "design.daily",    name: "Design Daily",    avatar: "D", color: "#6366f1", followers: "12.4K" },
  { id: 2, handle: "rajeshwari.dev",  name: "Rajeshwari",      avatar: "R", color: "#ec4899", followers: "3.1K"  },
  { id: 3, handle: "ui.threads",      name: "UI Threads",      avatar: "U", color: "#f59e0b", followers: "89.2K" },
  { id: 4, handle: "codewithjay",     name: "Jay Codes",       avatar: "J", color: "#10b981", followers: "7.8K"  },
  { id: 5, handle: "anya.creates",    name: "Anya Creates",    avatar: "A", color: "#8b5cf6", followers: "22.5K" },
  { id: 6, handle: "techbites",       name: "Tech Bites",      avatar: "T", color: "#ef4444", followers: "45.1K" },
  { id: 7, handle: "minimalist.life", name: "Minimalist Life", avatar: "M", color: "#06b6d4", followers: "18.9K" },
  { id: 8, handle: "sara.builds",     name: "Sara Builds",     avatar: "S", color: "#f97316", followers: "5.3K"  },
]

const RECENT_SEARCHES = ["design.daily", "ui.threads", "techbites"]

// ── Search Component ───────────────────────
function Search() {
  const [query, setQuery]     = useState("")
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState([])
  const [recents, setRecents] = useState(RECENT_SEARCHES)
  const inputRef              = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim() === "") { setResults([]); return }
    const q = query.toLowerCase()
    setResults(MOCK_USERS.filter(u =>
      u.handle.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
    ))
  }, [query])

  const clearQuery    = () => { setQuery(""); inputRef.current?.focus() }
  const removeRecent  = (handle, e) => { e.stopPropagation(); setRecents(r => r.filter(h => h !== handle)) }

  const showRecents = focused && query === "" && recents.length > 0
  const showResults = query.trim() !== ""
  const showEmpty   = query.trim() !== "" && results.length === 0
  const showDefault = !focused && query === ""

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#000",
      minHeight: "100vh",
      background: "#fff",
    }}>

      {/* ── Search bar ── */}
      <div style={{ padding: "12px 16px 0", maxWidth: 576, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: focused ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.04)",
            border: focused ? "1px solid rgba(0,0,0,0.2)" : "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            padding: "0 14px",
            height: 46,
            transition: "all 0.2s",
          }}
        >
          {/* Search icon */}
          <span style={{ color: focused ? "#000" : "#aaa", transition: "color 0.2s", flexShrink: 0 }}>
            <SearchIcon />
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#000",
              fontSize: 16,
              fontFamily: "inherit",
              caretColor: "#000",
            }}
          />

          {/* Clear button */}
          {query.length > 0 && (
            <button
              onClick={clearQuery}
              style={{
                width: 22, height: 22,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.12)",
                border: "none",
                color: "#000",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ maxWidth: 576, margin: "0 auto" }}>

        {/* Default — suggested */}
        {showDefault && (
          <div style={{ padding: "24px 16px 0" }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Suggested
            </p>
            {MOCK_USERS.slice(0, 5).map((user, i) => (
              <UserRow key={user.id} user={user} index={i} />
            ))}
          </div>
        )}

        {/* Recent searches */}
        {showRecents && (
          <div style={{ padding: "20px 16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: "#aaa", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
                Recent
              </p>
              <button
                onClick={() => setRecents([])}
                style={{ fontSize: 13, color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Clear all
              </button>
            </div>
            {recents.map((handle, i) => {
              const user = MOCK_USERS.find(u => u.handle === handle)
              if (!user) return null
              return (
                <UserRow
                  key={handle}
                  user={user}
                  index={i}
                  trailing={
                    <button
                      onClick={e => removeRecent(handle, e)}
                      style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", padding: 4 }}
                    >
                      <XIcon />
                    </button>
                  }
                />
              )
            })}
          </div>
        )}

        {/* Search results */}
        {showResults && !showEmpty && (
          <div style={{ paddingTop: 8 }}>
            {results.map((user, i) => (
              <UserRow key={user.id} user={user} index={i} highlightQuery={query} />
            ))}
          </div>
        )}

        {/* No results */}
        {showEmpty && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, color: "#000", fontWeight: 600, margin: "0 0 6px" }}>No results for "{query}"</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Try searching for people, topics, or keywords</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── UserRow ────────────────────────────────
function UserRow({ user, index, trailing, highlightQuery }) {
  const [hovered, setHovered]     = useState(false)
  const [following, setFollowing] = useState(false)

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
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          cursor: "pointer",
          background: hovered ? "rgba(0,0,0,0.03)" : "transparent",
          transition: "background 0.15s",
          animation: `fadeUp 0.3s ease ${index * 40}ms both`,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 44, height: 44,
          borderRadius: "50%",
          background: user.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 16, color: "#fff",
          flexShrink: 0,
        }}>
          {user.avatar}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#000", lineHeight: 1.3 }}>
            {highlight(user.name)}
          </div>
          <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.4 }}>
            {highlight(user.handle)} · {user.followers} followers
          </div>
        </div>

        {/* Follow button or trailing X */}
        {trailing ? trailing : (
          <button
            onClick={e => { e.stopPropagation(); setFollowing(f => !f) }}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.2)",
              background: following ? "rgba(0,0,0,0.06)" : "transparent",
              color: following ? "#aaa" : "#000",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: #bbb; }
      `}</style>
    </>
  )
}

export default Search