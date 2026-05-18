import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from './PostCard'
import { useAuth } from '../store/authStore.js'

const BASE_URL = "http://localhost:2167"

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
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

export default function LikedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user-api/users/liked-posts`,
          { withCredentials: true }
        );
        setPosts(response.data.payload);
      } catch (err) {
        setError("Failed to load liked posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Liked Posts</span>
      </div>

      {/* ── Header ── */}
      {/* <div style={{
        padding: "20px 16px 0",
        borderBottom: "1px solid #efefef",
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <HeartIcon filled={true} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000", margin: 0 }}>
            Liked
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "#999", margin: "4px 0 16px" }}>
          Posts you've liked
        </p>
      </div> */}

      {/* ── States ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#999", fontSize: 14 }}>
          Loading...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: 40, color: "#f44", fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 20px", gap: 12, color: "#999",
        }}>
          <HeartIcon filled={false} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>No liked posts yet</p>
          <p style={{ fontSize: 13, color: "#999", margin: 0, textAlign: "center" }}>
            Tap the heart icon on any post to like it.
          </p>
        </div>
      )}

      {/* ── Posts ── */}
      {!loading && !error && posts.map((post) => (
        <PostCard key={post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}