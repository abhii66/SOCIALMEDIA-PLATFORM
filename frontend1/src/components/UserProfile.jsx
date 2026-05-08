import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import {
  profileCard,
  profileStat,
  profileStatNumber,
  profileStatLabel,
  postGrid,
  postCardClass,
  postCardBody,
  postCaption,
  postMeta,
  primaryBtn,
  dangerBtn,
  secondaryBtn,
  formGroup,
  labelClass,
  inputClass,
  textareaClass,
  errorClass,
  loadingClass,
  emptyStateClass,
  headingClass,
  subHeadingClass,
  mutedText,
  avatar,
  modalOverlay,
  modalBox,
  modalHeader,
  modalTitle,
  modalBody,
  searchResultCard,
} from "../styles/common.js";

// ── Followers / Following Modal ─────────────────────────
function UserListModal({ title, users, onClose, onUserClick }) {
  return (
    <div className={modalOverlay} onClick={onClose}>
      <div className={modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={modalHeader}>
          <p className={modalTitle}>{title}</p>
          <button
            onClick={onClose}
            className="text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className={modalBody}>
          {users?.length === 0 ? (
            <p className="text-center text-[#a1a1a6] text-sm py-6">Nothing here yet.</p>
          ) : (
            users?.map((u) => (
              <div
                key={u._id}
                className={searchResultCard}
                onClick={() => { onClose(); onUserClick(u._id); }}
              >
                {u.profilePic ? (
                  <img src={u.profilePic} className="w-10 h-10 rounded-full object-cover" alt="" />
                ) : (
                  <div className={`${avatar} w-10 h-10`}>{u.name?.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{u.name}</p>
                  <p className="text-xs text-[#a1a1a6]">@{u.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null); // "followers" | "following" | null

  const { register, handleSubmit, formState: { errors } } = useForm();

  const fetchMyData = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get("/user-api/mine");
      setProfile(profileRes.data.payload);

      const postsRes = await api.get("/post-api/myposts");
      setPosts(postsRes.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyData(); }, []);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onUpdateProfile = async (formData) => {
    setUpdating(true);
    try {
      const data = new FormData();
      if (formData.name) data.append("name", formData.name);
      if (formData.bio) data.append("bio", formData.bio);
      if (formData.profilePic?.[0]) data.append("profilePic", formData.profilePic[0]);

      const res = await api.put("/user-api/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        setProfile(res.data.payload);
        setCurrentUser(res.data.payload);
        toast.success("Profile updated!");
        setEditMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const togglePrivacy = async () => {
    setPrivacyLoading(true);
    try {
      const res = await api.patch("/user-api/privacy", { isPrivate: !profile.isPrivate });
      setProfile(res.data.payload);
      setCurrentUser(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update privacy");
    } finally {
      setPrivacyLoading(false);
    }
  };

  if (loading) return <p className={loadingClass}>Loading profile...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!profile) return null;

  return (
    <div className="py-10">
      {/* Profile Card */}
      <div className={profileCard}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-5">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                className="w-20 h-20 rounded-full object-cover border border-[#e8e8ed] dark:border-[#38383a]"
                alt="profile"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#0066cc]/10 dark:bg-[#3399ff]/20 text-[#0066cc] dark:text-[#3399ff] flex items-center justify-center text-2xl font-semibold">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className={headingClass}>{profile.name}</h2>
              <p className={mutedText}>@{profile.username}</p>
              {profile.bio && <p className="text-sm text-[#6e6e73] dark:text-[#98989d] mt-1">{profile.bio}</p>}
              {/* Privacy badge */}
              <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                profile.isPrivate
                  ? "bg-[#ff9500]/15 text-[#c96300]"
                  : "bg-[#34c759]/15 text-[#248a3d]"
              }`}>
                {profile.isPrivate ? "🔒 Private" : "🌐 Public"}
              </span>
            </div>
          </div>

          {/* Right: stats — clickable to open modal */}
          <div className="flex gap-6">
            <div className={profileStat}>
              <span className={profileStatNumber}>{posts.length}</span>
              <span className={profileStatLabel}>Posts</span>
            </div>
            <div className={profileStat} onClick={() => setModal("followers")}>
              <span className={profileStatNumber}>{profile.followers?.length ?? 0}</span>
              <span className={profileStatLabel}>Followers</span>
            </div>
            <div className={profileStat} onClick={() => setModal("following")}>
              <span className={profileStatNumber}>{profile.following?.length ?? 0}</span>
              <span className={profileStatLabel}>Following</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-5">
          <button className={secondaryBtn} onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
          {/* Privacy Toggle */}
          <button
            className={secondaryBtn}
            onClick={togglePrivacy}
            disabled={privacyLoading}
          >
            {privacyLoading ? "…" : profile.isPrivate ? "Make Public" : "Make Private"}
          </button>
          <button className={dangerBtn} onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Edit Form */}
        {editMode && (
          <form onSubmit={handleSubmit(onUpdateProfile)} className="mt-6 border-t border-[#e8e8ed] dark:border-[#38383a] pt-5 flex flex-col gap-3">
            <p className={subHeadingClass}>Edit Profile</p>

            <div className={formGroup}>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                className={inputClass}
                defaultValue={profile.name}
                {...register("name")}
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Bio</label>
              <textarea
                className={textareaClass}
                rows={2}
                defaultValue={profile.bio}
                {...register("bio")}
              />
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-[#6e6e73] dark:text-[#98989d] file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066cc] file:text-white hover:file:bg-[#004499] cursor-pointer"
                {...register("profilePic")}
              />
            </div>

            <button type="submit" className={primaryBtn} disabled={updating}>
              {updating ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>

      {/* My Posts Grid */}
      <h3 className={`${subHeadingClass} mb-4`}>My Posts</h3>

      {posts.length === 0 ? (
        <p className={emptyStateClass}>No posts yet. Create your first post!</p>
      ) : (
        <div className={postGrid}>
          {posts.map((post) => (
            <div
              key={post.postId}
              className={postCardClass}
              onClick={() => navigate(`/post/${post.postId}`)}
            >
              <img src={post.imageUrl} alt="post" className="w-full aspect-square object-cover" />
              <div className={postCardBody}>
                {post.caption && (
                  <p className={postCaption}>
                    {post.caption.slice(0, 60)}{post.caption.length > 60 ? "…" : ""}
                  </p>
                )}
                <p className={postMeta}>
                  <span>♥ {post.likesCount ?? 0}</span>
                  <span>💬 {post.commentsCount ?? 0}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Followers Modal */}
      {modal === "followers" && (
        <UserListModal
          title={`Followers (${profile.followers?.length ?? 0})`}
          users={profile.followers}
          onClose={() => setModal(null)}
          onUserClick={(uid) => navigate(`/profile/${uid}`)}
        />
      )}

      {/* Following Modal */}
      {modal === "following" && (
        <UserListModal
          title={`Following (${profile.following?.length ?? 0})`}
          users={profile.following}
          onClose={() => setModal(null)}
          onUserClick={(uid) => navigate(`/profile/${uid}`)}
        />
      )}
    </div>
  );
}

export default UserProfile;
