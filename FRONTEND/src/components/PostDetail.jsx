import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../store/authStore'

const BASE_URL = "http://localhost:2167"

// ── Icons ──────────────────────────────────
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
      fill={filled ? "#e05454" : "none"}
      stroke={filled ? "#e05454" : "currentColor"}
      strokeWidth="1.8" strokeLinejoin="round"
    />
  </svg>
)

const BookmarkIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z"
      fill={filled ? "#000" : "none"}
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
    />
  </svg>
)

const CommentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n)

const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString("en-IN", { dateStyle: "medium" })
}

// ── Post Detail ────────────────────────────
export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, authLoading } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")
  const [commenting, setCommenting] = useState(false)
  
// ── Comment Card ───────────────────────────
function CommentCard({ comment }) {
  const navigate = useNavigate()
  return (
    <div style={{
      display: "flex", gap: 10,
      padding: "12px 0",
      borderBottom: "0.5px solid #f0f0f0",
    }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        {comment.user?.profileImageUrl ? (
          <img
            src={comment.user.profileImageUrl}
            alt=""
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: "#555",
          }}>
            {comment.user?.firstName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span onClick={() => navigate(`/app/profile/${comment.user?._id}`)}
            style={{ cursor: "pointer" }} 
            style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
            {comment.user?.firstName} {comment.user?.lastName}
          </span>
          <span style={{ fontSize: 12, color: "#aaa" }}>@{comment.user?.userName}</span>
          <span style={{ fontSize: 12, color: "#ccc", marginLeft: "auto" }}>
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: "#333" }}>
          {comment.comment}
        </p>
      </div>
    </div>
  )
}


useEffect(() => {
    if (authLoading) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/post-api/posts/${id}`, { withCredentials: true })
        const data = res.data.payload
        setPost(data)
        setLiked(data.likes?.some(lid => lid.toString() === currentUser?._id?.toString()))
        setLikeCount(data.likes?.length || 0)
        setSaved(currentUser?.savedPosts?.some(sid => sid.toString() === data._id?.toString()))
      } catch(err) {
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()

}, [id, currentUser, authLoading])

    const handleLike = async () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(c => newLiked ? c + 1 : c - 1)
    try {
      await axios.patch(`${BASE_URL}/post-api/posts/${id}/like`, {}, { withCredentials: true })
    } catch(err) {
      setLiked(!newLiked)
      setLikeCount(c => newLiked ? c - 1 : c + 1)
    }
  }

  const handleSave = async () => {
    const newSaved = !saved
    setSaved(newSaved)
    try {
      await axios.put(`${BASE_URL}/user-api/users/saved/${id}`, {}, { withCredentials: true })
    } catch(err) {
      setSaved(!newSaved)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    setCommenting(true)
    try {
      const res = await axios.put(
        `${BASE_URL}/post-api/posts/comments`,
        { postId: id, comment },
        { withCredentials: true }
      )
    setPost(prev => ({
      ...prev,
      comments: res.data.payload.comments,
    }))
      setComment("")
    } catch(err) {
      console.log(err)
    } finally {
      setCommenting(false)
    }
  }

    if(loading || authLoading) return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: 14 }}>
            Loading...
        </div>
    )

  if(error) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#e05454", fontSize: 14 }}>
      {error}
    </div>
  )

  if(!post) return null

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
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
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Post</span>
        {currentUser?._id?.toString() === post?.author?._id?.toString() ? (
            <div style={{display: "flex",width: "100%"}}>
        <button
            onClick={() => navigate("/edit-post", { state: { post } })}
            style={{ background: "#000",padding:8,borderRadius:50 ,border: "none", fontSize: 16, fontWeight: 700, color: "#FFFFFF", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }} >
            Edit
        </button></div>
        ) : (
      <div style={{ width: 40 }} />
      )}
      </div>

      <div style={{ maxWidth: 576, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* ── Post ── */}
        <div style={{ paddingBottom: 16, borderBottom: "0.5px solid #e5e5e5" }}>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {post.author?.profileImageUrl ? (
              <img
                src={post.author.profileImageUrl}
                alt=""
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 600, color: "#555",
              }}>
                {post.author?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div onClick={() => navigate(`/app/profile/${post.author?._id}`)} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
                {post.author?.firstName} {post.author?.lastName}
              </div>
              <div style={{ fontSize: 13, color: "#aaa" }}>@{post.author?.userName}</div>
            </div>
            <span style={{ fontSize: 13, color: "#ccc", marginLeft: "auto" }}>
              {formatTime(post.createdAt)}
            </span>
          </div>

          {/* Category */}
          {post.category && post.category !== "Other" && (
            <span style={{
              display: "inline-block",
              fontSize: 11, fontWeight: 500,
              color: "#888", background: "#f5f5f5",
              borderRadius: 6, padding: "2px 8px",
              marginBottom: 10,
            }}>
              {post.category}
            </span>
          )}

          {/* Content */}
          <p style={{ fontSize: 16, lineHeight: 1.7, margin: "0 0 12px", color: "#000" }}>
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt=""
              style={{
                width: "100%", borderRadius: 12,
                objectFit: "cover", maxHeight: 400,
                marginBottom: 12,
              }}
            />
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 20, alignItems: "center", paddingTop: 8 }}>
            <button
              onClick={handleLike}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 14, color: liked ? "#e05454" : "#888",
                padding: 0, fontFamily: "inherit", transition: "color 0.2s",
              }}
            >
              <HeartIcon filled={liked} />
              {fmt(likeCount)}
            </button>
              <CommentIcon filled={comment} /> 
            <span style={{ fontSize: 14, color: "#888" }}>
            {fmt(post.comments?.length || 0)}
            </span>

            <button
              onClick={handleSave}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 14, color: saved ? "#000" : "#888",
                padding: 0, fontFamily: "inherit", transition: "color 0.2s",
                marginLeft: "auto",
              }}
            >
              <BookmarkIcon filled={saved} />
            </button>
          </div>
        </div>

        {/* ── Comments ── */}
        <div style={{ marginTop: 8 }}>
          {post.comments?.length === 0 && (
            <p style={{ textAlign: "center", color: "#ccc", fontSize: 14, padding: "20px 0" }}>
              No comments yet — be the first!
            </p>
          )}
          {post.comments?.map((c, i) => (
            <CommentCard key={i} comment={c} />
          ))}
        </div>
      </div>

      {/* ── Add Comment bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "10px 16px",
        paddingBottom: "env(safe-area-inset-bottom, 10px)",
      }}>
        <div style={{
          maxWidth: 576, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt=""
              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#f0f0f0", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "#555",
            }}>
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Input */}
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => { if(e.key === "Enter") handleComment() }}
            placeholder="Add a comment..."
            style={{
              flex: 1, border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: 20, padding: "8px 14px",
              fontSize: 14, outline: "none",
              fontFamily: "inherit", background: "#fafafa",
            }}
          />

          {/* Send button */}
          <button
            onClick={handleComment}
            disabled={!comment.trim() || commenting}
            style={{
              background: comment.trim() ? "#000" : "rgba(0,0,0,0.08)",
              border: "none", borderRadius: "50%",
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: comment.trim() ? "#fff" : "#aaa",
              cursor: comment.trim() ? "pointer" : "not-allowed",
              flexShrink: 0, transition: "all 0.2s",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}