import { useState, useEffect } from "react";
import axios from "axios";

const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(isoString).toLocaleDateString();
}

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "#ff3040" : "none"}
    stroke={filled ? "#ff3040" : "currentColor"}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

function Avatar({ src, name = "", size = 38 }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#e8e4ff", "#d6f5ea", "#fce4ee", "#fff0d6", "#ddeeff"];
  const textColors = ["#3C3489", "#085041", "#72243E", "#633806", "#0C447C"];
  const idx = (name.charCodeAt(0) || 0) % colors.length;

  if (src && !imgErr) {
    return (
      <img src={src} alt={name} onError={() => setImgErr(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, display: "block" }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 600,
    }}>{initials}</div>
  );
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);

  const handleLike = () => {
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div style={{
      display: "flex", gap: 12, padding: "14px 16px",
      borderBottom: "1px solid #efefef",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Avatar only — no line */}
      <Avatar src={post.avatarUrl} name={post.author_name || "U"} size={38} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
            {post.author_name || "Unknown"}
          </span>
          <span style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>
            {post.createdAt ? timeAgo(post.createdAt) : ""}
          </span>
          <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4, display: "flex" }}>
            <MoreIcon />
          </button>
        </div>

        {/* Text */}
        {post.content && (
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "#000", margin: "0 0 10px" }}>
            {post.content}
          </p>
        )}

        {/* Image */}
        {post.imageUrl && (
          <img src={post.imageUrl} alt="post"
            style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 10, border: "1px solid #efefef", marginBottom: 10, display: "block" }} />
        )}

        {/* Actions — heart and comment only */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
          <button onClick={handleLike} aria-label="like" style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px 10px 6px 0", display: "flex", alignItems: "center",
            color: liked ? "#ff3040" : "#555", transition: "transform 0.1s",
          }}>
            <HeartIcon filled={liked} />
          </button>

          <button aria-label="comment" style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px 10px", display: "flex", alignItems: "center", color: "#555",
          }}>
            <CommentIcon />
          </button>
        </div>

        {/* Counts */}
        {(likeCount > 0 || post.comments > 0) && (
          <div style={{ fontSize: 13, color: "#999", marginTop: 3 }}>
            {likeCount > 0 && `${fmt(likeCount)} like${likeCount === 1 ? "" : "s"}`}
            {likeCount > 0 && post.comments > 0 && " · "}
            {post.comments > 0 && `${fmt(post.comments)} repl${post.comments === 1 ? "y" : "ies"}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Following() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:2167/user-api/posts/fyp");
        setPosts(response.data.payload);
      } catch (err) {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "#999", fontSize: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: 40, color: "#f44", fontSize: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {error}
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}