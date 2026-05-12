import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import axios from 'axios'
import { useAuth } from '../store/authStore'

const BASE_URL = "http://localhost:2167"

const CATEGORIES = ["Music", "Art", "Food", "Travel", "Fitness", "Gaming", "Thoughts", "Other"]

// ── Icons ──────────────────────────────────
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── EditPost Component ──────────────────────
function EditPost() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  // post is passed via navigate state: navigate('/edit-post', { state: { post } })
  const post = location.state?.post

  const [text, setText] = useState(post?.content || "")
  const [category, setCategory] = useState(post?.category || "Other")
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState(null)

  const MAX_CHARS = 500
  const remaining = MAX_CHARS - text.length
  const isOverLimit = remaining < 0
  const isEmpty = !text.trim()
  const unchanged = text === post?.content && category === post?.category

  // ── Edit ──────────────────────────────────
  const handleSave = async () => {
    if (isEmpty || isOverLimit || unchanged) return
    setLoading(true)
    setError(null)
    try {
      await axios.put(
        `${BASE_URL}/post-api/posts`,
        { postId: post._id, content: text },
        { withCredentials: true }
      )
      navigate(`/post/${post._id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post.")
      setLoading(false)
    }
  }

  // ── Delete (soft) ─────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true)
    setError(null)
    try {
      await axios.patch(
        `${BASE_URL}/post-api/posts`,
        { postId: post._id, isPostActive: false },
        { withCredentials: true }
      )
      navigate("/app/foryou", { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post.")
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!post) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
      No post data found.
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        textarea { resize: none; }
        textarea::placeholder { color: #ccc; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 16px",
        height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 576, margin: "0 auto",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none", border: "none",
            color: "#000", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 4,
            fontFamily: "inherit",
          }}
        >
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Edit post</span>
        {/* Delete button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            background: "none", border: "none",
            color: "#e05454", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 4,
          }}
          title="Delete post"
        >
          <TrashIcon />
        </button>
      </div>

      {/* ── Compose area ── */}
      <div style={{ maxWidth: 576, margin: "0 auto", padding: "16px 16px 120px" }}>
        <div style={{ display: "flex", gap: 12, animation: "fadeIn 0.3s ease" }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser.profileImageUrl}
                alt=""
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 16, color: "#555",
              }}>
                {currentUser?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ width: 2, flex: 1, minHeight: 20, background: "rgba(0,0,0,0.08)", marginTop: 8, borderRadius: 2 }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 4 }}>
              {currentUser?.userName || currentUser?.firstName}
            </div>

            {/* Textarea */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's new?"
              rows={5}
              style={{
                width: "100%", border: "none", outline: "none",
                fontSize: 16, color: "#000",
                background: "transparent", fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            />

            {/* Category selector */}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: category === cat ? "1.5px solid #000" : "1.5px solid rgba(0,0,0,0.1)",
                    background: category === cat ? "#000" : "transparent",
                    color: category === cat ? "#fff" : "#888",
                    fontSize: 12, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Existing image (read-only) */}
            {post.imageUrl && (
              <div style={{ marginTop: 12, position: "relative", borderRadius: 12, overflow: "hidden" }}>
                <img
                  src={post.imageUrl}
                  alt=""
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 8, left: 8,
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  fontSize: 11, padding: "2px 8px", borderRadius: 6,
                }}>
                  Image can't be changed
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p style={{ fontSize: 13, color: "#e05454", marginTop: 10 }}>{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "12px 16px",
        paddingBottom: "env(safe-area-inset-bottom, 12px)",
      }}>
        <div style={{
          maxWidth: 576, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Character count */}
          <span style={{
            fontSize: 13,
            color: isOverLimit ? "#e05454" : remaining < 50 ? "#f59e0b" : "#ccc",
          }}>
            {remaining < 100 ? remaining : ""}
          </span>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isEmpty || isOverLimit || loading || unchanged}
            style={{
              padding: "10px 24px",
              borderRadius: 20, border: "none",
              background: isEmpty || isOverLimit || unchanged ? "rgba(0,0,0,0.08)" : "#000",
              color: isEmpty || isOverLimit || unchanged ? "#aaa" : "#fff",
              fontSize: 15, fontWeight: 600,
              cursor: isEmpty || isOverLimit || unchanged ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* ── Delete confirm sheet ── */}
      {showDeleteConfirm && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDeleteConfirm(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 20,
            }}
          />
          {/* Sheet */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#fff",
            borderRadius: "20px 20px 0 0",
            padding: "24px 16px 40px",
            zIndex: 21,
            animation: "slideUp 0.25s ease",
            maxWidth: 576, margin: "0 auto",
          }}>
            <div style={{ width: 36, height: 4, background: "#e5e5e5", borderRadius: 2, margin: "0 auto 20px" }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "#000", margin: "0 0 6px" }}>
              Delete post?
            </p>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 24px" }}>
              This will hide your post. This action can't be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                width: "100%", padding: "14px",
                borderRadius: 14, border: "none",
                background: "#e05454", color: "#fff",
                fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                width: "100%", padding: "14px",
                borderRadius: 14, border: "1.5px solid rgba(0,0,0,0.1)",
                background: "transparent", color: "#000",
                fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default EditPost