import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios"

const BASE_URL = "http://localhost:2167"

// ── Icons ──────────────────────────────────
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RestoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12a9 9 0 109-9 9 9 0 00-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Helpers ────────────────────────────────
const getDaysLeft = (deletedAt) => {
  if (!deletedAt) return 30
  const diff = Date.now() - new Date(deletedAt).getTime()
  const daysGone = Math.floor(diff / (1000 * 60 * 60 * 24))
  return Math.max(0, 30 - daysGone)
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" })

// ── Post Row ───────────────────────────────
function DeletedPostCard({ post, onRestore }) {
  const [restoring, setRestoring] = useState(false)
  const [restored, setRestored] = useState(false)
  const daysLeft = getDaysLeft(post.deletedAt)
  const urgent = daysLeft <= 5

  const handleRestore = async (e) => {
    e.stopPropagation()
    if (restoring || restored) return
    setRestoring(true)
    try {
      await axios.patch(
        `${BASE_URL}/post-api/posts`,
        { postId: post._id, isPostActive: true },
        { withCredentials: true }
      )
      setRestored(true)
      setTimeout(() => onRestore(post._id), 800)
    } catch (err) {
      console.error(err)
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div style={{
      padding: "14px 16px",
      borderBottom: "0.5px solid #f0f0f0",
      opacity: restored ? 0.4 : 1,
      transition: "opacity 0.4s",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        {/* Thumbnail or placeholder */}
        <div style={{
          width: 56, height: 56, borderRadius: 10,
          background: "#f5f5f5", flexShrink: 0,
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#ccc",
        }}>
          {post.imageUrl
            ? <img src={post.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ImageIcon />
          }
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 14, color: "#000", lineHeight: 1.5,
            margin: "0 0 6px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {post.content}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#aaa" }}>
              Posted {formatDate(post.createdAt)}
            </span>
            <span style={{ fontSize: 12, color: "#ccc" }}>·</span>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: urgent ? "#e05454" : "#aaa",
            }}>
              {daysLeft === 0
                ? "Deletes today"
                : `${daysLeft}d left`
              }
            </span>
            {urgent && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                background: "#fff0f0", color: "#e05454",
                borderRadius: 6, padding: "1px 7px",
              }}>
                Expiring soon
              </span>
            )}
          </div>
        </div>

        {/* Restore button */}
        <button
          onClick={handleRestore}
          disabled={restoring || restored}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 12px", borderRadius: 20,
            border: "1.5px solid #000",
            background: restored ? "#e6f4ed" : "#fff",
            color: restored ? "#1a7a3a" : "#000",
            fontSize: 13, fontWeight: 600,
            cursor: restoring ? "not-allowed" : "pointer",
            fontFamily: "inherit", flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {restored ? "✓" : restoring ? "..." : <><RestoreIcon /> Restore</>}
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────
export default function RecentlyDeleted() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/post-api/posts/deleted`, { withCredentials: true })
        setPosts(res.data.payload ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleRestore = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  // Sort by daysLeft ascending (expiring soonest first)
  const sorted = [...posts].sort((a, b) => getDaysLeft(a.deletedAt) - getDaysLeft(b.deletedAt))

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
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Recently Deleted</span>
      </div>

      <div style={{ maxWidth: 576, margin: "0 auto" }}>

        {/* Info banner */}
        <div style={{
          margin: "12px 16px",
          padding: "12px 14px",
          background: "#fafafa", border: "0.5px solid #ebebeb",
          borderRadius: 12,
          fontSize: 13, color: "#888", lineHeight: 1.5,
        }}>
          Deleted posts are permanently removed after <strong style={{ color: "#000" }}>30 days</strong>. Restore them before they expire.
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
            Loading...
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "60px 20px", gap: 8,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M19 6l-1 14H6L5 6" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11v6M14 11v6" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M9 6V4h6v2" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>Nothing here</p>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Deleted posts will appear here for 30 days.</p>
          </div>
        ) : (
          <div>
            {sorted.map(post => (
              <DeletedPostCard key={post._id} post={post} onRestore={handleRestore} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}