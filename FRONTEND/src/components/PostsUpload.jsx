
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../store/authStore'

const BASE_URL = "http://localhost:2167"

const CATEGORIES = ["Music", "Art", "Food", "Travel", "Fitness", "Gaming", "Thoughts", "Other"]

// ── Icons ──────────────────────────────────
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ImageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path d="M3 15l5-5 4 4 3-3 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── PostsUpload Component ──────────────────
function PostsUpload() {
  const navigate = useNavigate()
  const fileRef  = useRef(null)
  const { currentUser } = useAuth()

  const [text, setText]         = useState("")
  const [images, setImages]     = useState([])   // { url, file }
  const [category, setCategory] = useState("Other")
  const [loading, setLoading]   = useState(false)
//   const [audience, setAudience] = useState("Anyone")

  const MAX_CHARS = 500

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 4))  // max 4 images
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handlePost = async () => {
    if (!text.trim() && images.length === 0) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("content", text)
      formData.append("author", currentUser._id)
      formData.append("category", category)
      if (images.length > 0) {
        formData.append("imageUrl", images[0].file) // only first image
      }
      // images.forEach(img => formData.append("imageUrl", img.file))  // ← send actual files

      const post = await axios.post(
        `${BASE_URL}/post-api/posts`,
        formData,
        { withCredentials: true }
      )

      if (post.status === 201) {
        setLoading(false)
        navigate("/app/foryou")
      }
    } catch (err) {
      setLoading(false)
      console.log("Post failed:", err.response?.data?.message || err.message)
    }
  }

  const remaining = MAX_CHARS - text.length
  const isOverLimit = remaining < 0
  const isEmpty = !text.trim() && images.length === 0

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
            fontSize: 15, fontWeight: 500,
            color: "#000", cursor: "pointer",
            fontFamily: "inherit", padding: "8px 0",
          }}
        >
          Cancel
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>New post</span>
        <div style={{ width: 60 }} />
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
            {/* Thread line */}
            <div style={{ width: 2, flex: 1, minHeight: 20, background: "rgba(0,0,0,0.08)", marginTop: 8, borderRadius: 2 }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {/* Username */}
            <div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 4 }}>
              {currentUser?.userName || currentUser?.firstName}
            </div>

            {/* Text area */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's new?"
              rows={4}
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

            {/* Image previews */}
            {images.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: images.length === 1 ? "1fr" : "1fr 1fr",
                gap: 6, marginTop: 10, borderRadius: 12, overflow: "hidden",
              }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                    <img
                      src={img.url}
                      alt=""
                      style={{
                        width: "100%",
                        height: images.length === 1 ? 300 : 160,
                        objectFit: "cover", display: "block",
                      }}
                    />
                    <button
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute", top: 6, right: 6,
                        width: 26, height: 26, borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        border: "none", color: "#fff",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action icons */}
            <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagePick}
                style={{ display: "none" }}
              />
              {[
                { Icon: ImageIcon, action: () => fileRef.current?.click(), label: "Image" },
              ].map(({ Icon, action, label }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    background: "none", border: "none",
                    color: "#aaa", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 4, borderRadius: 8,
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#000"; e.currentTarget.style.background = "rgba(0,0,0,0.05)" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.background = "transparent" }}
                  aria-label={label}
                >
                  <Icon />
                </button>
              ))}
            </div>
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

          {/* Post button */}
          <button
            onClick={handlePost}
            disabled={isEmpty || isOverLimit || loading}
            style={{
              padding: "10px 24px",
              borderRadius: 20,
              border: "none",
              background: isEmpty || isOverLimit ? "rgba(0,0,0,0.08)" : "#000",
              color: isEmpty || isOverLimit ? "#aaa" : "#fff",
              fontSize: 15, fontWeight: 600,
              cursor: isEmpty || isOverLimit ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!isEmpty && !isOverLimit) e.currentTarget.style.background = "#222" }}
            onMouseLeave={e => { if (!isEmpty && !isOverLimit) e.currentTarget.style.background = "#000" }}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostsUpload
