import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../store/authStore'

const BASE_URL = "http://localhost:2167"

// ── Icons ──────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
      fill={filled ? "#e05454" : "none"}
      stroke={filled ? "#e05454" : "currentColor"}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

const CommentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
)

const BookmarkIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z"
      fill={filled ? "#000" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

export const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n)

export const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)    return `${diff}s`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

// ── Post Card ──────────────────────────────
export default function PostCard({ post, defaultSaved  }) {
  const navigate = useNavigate()
    const { currentUser, authLoading } = useAuth()
    const currentUserId = currentUser?._id
    const [liked, setLiked] = useState(false)
    useEffect(() => {
      if (authLoading || !currentUserId) return
      const isLiked = post.likes?.some(id => {
      const likeId = id?._id ?? id
      return likeId?.toString() === currentUserId.toString()}) ?? false
      setLiked(isLiked)
      }, [authLoading,currentUserId, post._id])
    const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0)
    const [saved, setSaved] = useState(
    defaultSaved !== undefined
      ? defaultSaved
      : currentUser?.savedPosts?.some(id => id.toString() === post._id?.toString()) ?? false
  )

  const handleLike = async (e) => {
    e.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(c => newLiked ? c + 1 : c - 1)
    try {
      await axios.patch(`${BASE_URL}/post-api/posts/${post._id}/like`, {}, { withCredentials: true })
    } catch(err) {
      setLiked(!newLiked)
      setLikeCount(c => newLiked ? c - 1 : c + 1)
    }
  }

  const handleSave = async (e) => {
    e.stopPropagation()
    const newSaved = !saved
    setSaved(newSaved)
    try {
      await axios.put(`${BASE_URL}/user-api/users/saved/${post._id}`, {}, { withCredentials: true })
    } catch(err) {
      setSaved(!newSaved)
    }
  }

  return (
    <div
      onClick={() => navigate(`/post/${post._id}`)}
      style={{
        display: "flex", gap: 12,
        padding: "16px 0",
        borderBottom: "0.5px solid #e5e5e5",
        cursor: "pointer",
      }}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        {post.author?.profileImageUrl ? (
          <img
            src={post.author.profileImageUrl}
            alt=""
            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 600, color: "#555",
          }}>
            {post.author?.firstName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            {post.author?.firstName} {post.author?.lastName}
          </span>
          <span style={{ fontSize: 13, color: "#aaa" }}>@{post.author?.userName}</span>
          <span style={{ fontSize: 13, color: "#ccc", marginLeft: "auto" }}>
            {formatTime(post.createdAt)}
          </span>
        </div>

        {/* Category badge */}
        {post.category && post.category !== "Other" && (
          <span style={{
            display: "inline-block",
            fontSize: 11, fontWeight: 500,
            color: "#888", background: "#f5f5f5",
            borderRadius: 6, padding: "2px 8px",
            marginBottom: 6,
          }}>
            {post.category}
          </span>
        )}

        {/* Content */}
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 10px", color: "#000" }}>
          {post.content}
        </p>

        {/* Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt=""
            style={{
              width: "100%", borderRadius: 12,
              objectFit: "cover", maxHeight: 300,
              marginBottom: 10,
            }}
          />
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button
            onClick={handleLike}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, color: liked ? "#e05454" : "#888",
              padding: 0, fontFamily: "inherit",
              transition: "color 0.2s",
            }}
          >
            <HeartIcon filled={liked} />
            {fmt(likeCount)}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/post/${post._id}`) }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, color: "#888",
              padding: 0, fontFamily: "inherit",
            }}
          >
            <CommentIcon />
            {fmt(post.comments?.length || 0)}
          </button>

          <button
            onClick={handleSave}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, color: saved ? "#000" : "#888",
              padding: 0, fontFamily: "inherit",
              marginLeft: "auto",
              transition: "color 0.2s",
            }}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>
      </div>
    </div>
  )
}