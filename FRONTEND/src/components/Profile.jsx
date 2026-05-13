import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import { useNavigate } from "react-router";

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const RepliesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

function Avatar({ src, name = "", size = 72 }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#e8e4ff", "#d6f5ea", "#fce4ee", "#fff0d6", "#ddeeff"];
  const textColors = ["#3C3489", "#085041", "#72243E", "#633806", "#0C447C"];
  const idx = (name.charCodeAt(0) || 0) % colors.length;

  if (src && !imgErr) {
    return (
      <img src={src} alt={name} onError={() => setImgErr(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 600,
    }}>{initials}</div>
  );
}

function StatItem({ count, label }) {
  return (
    <div style={{ textAlign: "center", cursor: "pointer" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>{count ?? 0}</div>
      <div style={{ fontSize: 13, color: "#999" }}>{label}</div>
    </div>
  );
}

export default function Profile() {
  const navigate=useNavigate()
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("threads");
  const [loading, setLoading] = useState(true);
 async function editProfile(){

}
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authRes = await axios.get(
          "http://localhost:2167/user-api/check-auth",
          { withCredentials: true }
        );
        setUser(authRes.data.payload);

        const postsRes = await axios.get(
          "http://localhost:2167/user-api/posts/fyp",
          { withCredentials: true }
        );
        // filter only current user's posts
        const myPosts = postsRes.data.payload.filter(
          (p) => p.author === authRes.data.payload._id
        );
        setPosts(myPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60, color: "#999", fontSize: 14,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      Loading...
    </div>
  );

  if (!user) return (
    <div style={{ textAlign: "center", padding: 60, color: "#f44", fontSize: 14 }}>
      Failed to load profile.
    </div>
  );

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#fff", minHeight: "100vh",
    }}>

      {/* ── Profile header ── */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000", margin: "0 0 2px" }}>
              {fullName || "No Name"}
            </h1>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>
              @{user.userName ?? "username"}
            </p>
          </div>
          <Avatar src={user.profileImageUrl} name={fullName} size={72} />
        </div>

        {/* Bio */}
        {user.bio && (
          <p style={{ fontSize: 14, color: "#000", lineHeight: 1.5, margin: "0 0 14px" }}>
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div style={{
          display: "flex", gap: 28, marginBottom: 16, alignItems: "center"
        }}>
          <StatItem count={user.followers?.length} label="followers" />
          <div style={{ width: 1, height: 24, background: "#efefef" }} />
          <StatItem count={user.following?.length} label="following" />
          <div style={{ width: 1, height: 24, background: "#efefef" }} />
          <StatItem count={posts.length} label="posts" />
        </div>

        {/* Edit profile button */}
        <button style={{
          width: "100%", height: 38, borderRadius: 10,
          border: "1.5px solid #dbdbdb", background: "#fff",
          fontSize: 14, fontWeight: 600, color: "#000",
          cursor: "pointer", marginBottom: 16,
          fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          onClick={()=>navigate('/editprofile')}
        >
          Edit profile
        </button>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex", borderBottom: "1px solid #efefef",
      }}>
        {[
          { key: "threads", icon: <GridIcon />, label: "Threads" },
          { key: "replies", icon: <RepliesIcon />, label: "Replies" },
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

      {/* ── Posts / Empty state ── */}
      {activeTab === "threads" && (
        posts.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "60px 20px", gap: 10,
          }}>
            <GridIcon />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>No threads yet</p>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Posts you create will appear here.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={{
              padding: "14px 16px", borderBottom: "1px solid #efefef",
            }}>
              <p style={{ fontSize: 14, color: "#000", margin: "0 0 6px", lineHeight: 1.55 }}>
                {post.content}
              </p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="post"
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10, border: "1px solid #efefef" }} />
              )}
              <div style={{ fontSize: 13, color: "#999", marginTop: 8 }}>
                {post.likes ?? 0} likes · {post.comments ?? 0} replies
              </div>
            </div>
          ))
        )
      )}

      {activeTab === "replies" && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 20px", gap: 10,
        }}>
          <RepliesIcon />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#000", margin: 0 }}>No replies yet</p>
          <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Replies you make will appear here.</p>
        </div>
      )}
      <Footer />
    </div>
  );
}