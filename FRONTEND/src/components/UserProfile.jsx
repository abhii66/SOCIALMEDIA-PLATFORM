import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../store/authStore"
import PostCard from "./PostCard"

const BASE_URL = "http://localhost:2167"

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)

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

function StatItem({ count, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>{count ?? 0}</div>
      <div style={{ fontSize: 13, color: "#999" }}>{label}</div>
    </div>
  )
}

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, updateFollowing } = useAuth()
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwnProfile = currentUser?._id?.toString() === id

  const followed = currentUser?.following?.some(fid => {
    const f = fid?._id ?? fid
    return f?.toString() === id
  }) ?? false

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `${BASE_URL}/user-api/users/profile/${id}`,
          { withCredentials: true }
        )
        setUser(res.data.payload)
        setPosts(res.data.posts ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

    const handleFollow = async () => {
        if (followLoading || !user) return
        setFollowLoading(true)
        const newFollowed = !followed
        updateFollowing(id, newFollowed)

        setUser(prev => ({
            ...prev,
            followers: newFollowed
            ? [...(prev.followers ?? []), currentUser._id] : (prev.followers ?? []).filter(fid => {
                const f = fid?._id ?? fid
                return f?.toString() !== currentUser._id?.toString()
            })
        }))

        try {
        await axios.put(
        `${BASE_URL}/user-api/users/following`,
        { email: user.email },
        { withCredentials: true }
        )
    } catch (err) {
        updateFollowing(id, !newFollowed)
        // Revert local state too
        setUser(prev => ({
         ...prev,
        followers: newFollowed? (prev.followers ?? []).filter(fid => {
            const f = fid?._id ?? fid
            return f?.toString() !== currentUser._id?.toString()
          })
        : [...(prev.followers ?? []), currentUser._id]
        }))
    } finally {
        setFollowLoading(false)
    }
    }

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60, color: "#999", fontSize: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      Loading...
    </div>
  )

  if (!user) return (
    <div style={{ textAlign: "center", padding: 60, color: "#f44", fontSize: 14 }}>
      User not found.
    </div>
  )

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#fff", minHeight: "100vh",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        padding: "0 16px", height: 54,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "#000",
          cursor: "pointer", display: "flex", alignItems: "center", padding: 4,
        }}>
          <BackIcon />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#000", flex: 1, textAlign: "center",}}>
          {user.userName || "Profile"}
        </span>

        {isOwnProfile && (
        <button
            onClick={() => navigate("/app/settings")}
            style={{ background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", padding: 4, marginLeft: "auto", color: "#000" }}
            >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
     </button> 
    )}
      </div>

      {/* ── Profile header ── */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000", margin: "0 0 2px", height:'3rem' }}>
              {fullName || "No Name"}
            </h1>
      {/* Stats */}
        <div style={{ display: "flex", gap: 28, marginBottom: 16, alignItems: "center" }}>
          <StatItem count={posts.length} label="posts" />
          <div style={{ width: 1, height: 24, background: "#efefef" }} />         
          <StatItem count={user.followers?.length} label="followers" />
          <div style={{ width: 1, height: 24, background: "#efefef" }} />
          <StatItem count={user.following?.length} label="following" />
        </div>
          </div>
          <div
            onClick={() => user.profileImageUrl && setLightbox(true)}
            style={{ cursor: user.profileImageUrl ? "pointer" : "default" }}
          >
          <Avatar src={user.profileImageUrl} name={fullName} size={72} />
          </div>
        </div>
        {user.bio && (
          <p style={{ fontSize: 14, color: "#000", lineHeight: 1.5, margin: "0 0 14px" }}>
            {user.bio}
          </p>
        )}

        {/* Follow or Edit button */}
        {isOwnProfile ? (
          <button
            onClick={() => navigate('/editprofile')}
            style={{
              width: "100%", height: 38, borderRadius: 10,
              border: "1.5px solid #dbdbdb", background: "#fff",
              fontSize: 14, fontWeight: 600, color: "#000",
              cursor: "pointer", marginBottom: 16, fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            Edit profile
          </button>
        ) : (
          <button
            onClick={handleFollow}
            disabled={followLoading}
            style={{
              width: "100%", height: 38, borderRadius: 10,
              border: followed ? "1.5px solid #dbdbdb" : "none",
              background: followed ? "#fff" : "#000",
              fontSize: 14, fontWeight: 600,
              color: followed ? "#000" : "#fff",
              cursor: "pointer", marginBottom: 16,
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {followLoading ? "..." : followed ? "Following" : "Follow"}
          </button>
        )}
      </div>
            {/* ── Tabs ── */}
      <div style={{
        display: "flex", borderBottom: "1px solid #efefef",
      }}>
        {[
          { key: "posts", icon: <GridIcon />, label: "Posts" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, padding: "12px 0",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
            color: activeTab === tab.key ? "#000" : "#999",
            borderBottom: activeTab === tab.key ? "2px solid #000" : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ borderBottom: "1px solid #efefef" }} />

      {/* ── Posts ── */}
      {/* {posts.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 20px", gap: 10,
        }}>
          <GridIcon />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>No posts yet</p>
          <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Posts will appear here.</p>
        </div>
      ) : (
        <div style={{ padding: "0 16px" }}>
          {posts.map(post => (
            <PostCard key={post._id} post={post} currentUser={currentUser} />
          ))}
        </div>
      )} */}
            {activeTab === "posts" && (
        posts.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "60px 20px", gap: 10,
          }}>
            <GridIcon />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>No Posts yet</p>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Posts you create will appear here.</p>
          </div>
        ) : (
        <div style={{ padding: "0 16px" }}>
          {posts.map(post => (
            <PostCard key={post._id} post={post} currentUser={currentUser} />
          ))}
        </div>
        )
      )}
      {lightbox && (
  <div
    onClick={() => setLightbox(false)}
    style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.95)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    <button
      onClick={() => setLightbox(false)}
      style={{
        position: "absolute", top: 16, right: 16,
        background: "rgba(255,255,255,0.15)",
        border: "none", borderRadius: "50%",
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#fff",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
    <img
      src={user.profileImageUrl}
      alt=""
      onClick={e => e.stopPropagation()}
      style={{
        maxWidth: "95vw", maxHeight: "95vh",
        objectFit: "contain", borderRadius: 8,
      }}
    />
  </div>
    )}
    </div>
  )
}