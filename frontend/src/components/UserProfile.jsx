import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import {
  profileCard, profileStat, profileStatNumber, profileStatLabel,
  primaryBtn, dangerBtn, secondaryBtn,
  formGroup, labelClass, inputClass, textareaClass,
  errorClass, loadingClass, emptyStateClass,
  headingClass, subHeadingClass, mutedText, avatar,
  modalOverlay, modalBox, modalHeader, modalTitle, modalBody,
  searchResultCard, postGrid, postCardClass, postCardBody,
  postCaption, postMeta, badgePrivate, badgePublic,
} from "../styles/common.js";

// ── Shared Modal ───────────────────────────────────────
function UserListModal({ title, users, onClose, onUserClick }) {
  return (
    <div className={modalOverlay} onClick={onClose}>
      <div className={modalBox} onClick={e => e.stopPropagation()}>
        <div className={modalHeader}>
          <p className={modalTitle}>{title}</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#a1a1aa] text-lg transition">×</button>
        </div>
        <div className={modalBody}>
          {!users?.length
            ? <p className="text-center text-[#a1a1aa] text-sm py-8">Nothing here yet.</p>
            : users.map(u => (
                <div key={u._id} className={searchResultCard} onClick={() => { onClose(); onUserClick(u._id); }}>
                  {u.profilePic
                    ? <img src={u.profilePic} className="w-10 h-10 rounded-full object-cover" alt="" />
                    : <div className={`${avatar} w-10 h-10 text-sm`}>{u.name?.charAt(0).toUpperCase()}</div>
                  }
                  <div>
                    <p className="text-sm font-semibold text-[#18181b] dark:text-white">{u.name}</p>
                    <p className={mutedText}>@{u.username}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

// ── Follow Requests Panel ─────────────────────────────
function FollowRequestsPanel({ requests, onAccept, onReject, onNavigate }) {
  if (!requests?.length) return null;
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 mb-6">
      <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
        <span>🔔</span> Follow Requests ({requests.length})
      </p>
      <div className="flex flex-col gap-2">
        {requests.map(r => (
          <div key={r._id} className="flex items-center justify-between bg-white dark:bg-[#18181b] rounded-xl px-3 py-2.5 border border-amber-100 dark:border-amber-900/30">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => onNavigate(r._id)}
            >
              {r.profilePic
                ? <img src={r.profilePic} className="w-8 h-8 rounded-full object-cover" alt="" />
                : <div className={`${avatar} w-8 h-8 text-xs`}>{r.name?.charAt(0).toUpperCase()}</div>
              }
              <div>
                <p className="text-sm font-semibold text-[#18181b] dark:text-white leading-tight">{r.name}</p>
                <p className={mutedText}>@{r.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(r._id)}
                className="text-xs font-semibold px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition active:scale-95"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(r._id)}
                className="text-xs font-semibold px-3 py-1.5 border border-[#e4e4e7] dark:border-[#3f3f46] text-[#71717a] dark:text-[#a1a1aa] rounded-lg hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition active:scale-95"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Change Password Form ──────────────────────────────
function ChangePasswordForm({ onClose }) {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/user-api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(res.data.message || "Password changed successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#e4e4e7] dark:border-[#27272a]">
      <div className="flex items-center justify-between mb-4">
        <p className={subHeadingClass}>Change Password</p>
        <button
          onClick={onClose}
          className="text-xs text-[#a1a1aa] hover:text-[#71717a] transition"
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className={formGroup}>
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Enter current password"
            {...register("currentPassword", { required: "Current password is required" })}
          />
          {errors.currentPassword && <p className="text-xs text-rose-500 mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div className={formGroup}>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Min. 8 characters"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "At least 8 characters required" },
            })}
          />
          {errors.newPassword && <p className="text-xs text-rose-500 mt-1">{errors.newPassword.message}</p>}
        </div>
        <div className={formGroup}>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Re-enter new password"
            {...register("confirmPassword", { required: "Please confirm your new password" })}
          />
          {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className={primaryBtn} disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function UserProfile() {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]             = useState(null);
  const [posts, setPosts]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [editMode, setEditMode]           = useState(false);
  const [updating, setUpdating]           = useState(false);
  const [privacyLoading, setPrivacy]      = useState(false);
  const [modal, setModal]                 = useState(null); // "followers" | "following"
  const [showChangePwd, setShowChangePwd] = useState(false);

  const { register, handleSubmit } = useForm();

  const fetchMyData = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        api.get("/user-api/mine"),
        api.get("/post-api/myposts"),
      ]);
      setProfile(profileRes.data.payload);
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
      if (formData.name)           data.append("name", formData.name);
      if (formData.bio !== undefined) data.append("bio", formData.bio);
      if (formData.profilePic?.[0]) data.append("profilePic", formData.profilePic[0]);

      const res = await api.put("/user-api/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.payload);
      setCurrentUser(res.data.payload);
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const togglePrivacy = async () => {
    setPrivacy(true);
    try {
      const res = await api.patch("/user-api/privacy", { isPrivate: !profile.isPrivate });
      setProfile(res.data.payload);
      setCurrentUser(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update privacy");
    } finally {
      setPrivacy(false);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await api.put(`/user-api/follow-request/${requesterId}/accept`);
      toast.success("Request accepted!");
      setProfile(prev => ({
        ...prev,
        followRequests: prev.followRequests.filter(r => r._id !== requesterId),
        followers: [...(prev.followers || []), prev.followRequests.find(r => r._id === requesterId)],
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await api.put(`/user-api/follow-request/${requesterId}/reject`);
      toast.success("Request declined.");
      setProfile(prev => ({
        ...prev,
        followRequests: prev.followRequests.filter(r => r._id !== requesterId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <p className={loadingClass}>Loading profile…</p>;
  if (error)   return <p className={errorClass}>{error}</p>;
  if (!profile) return null;

  return (
    <div className="py-8">

      {/* Follow Requests Panel */}
      {profile.isPrivate && (
        <FollowRequestsPanel
          requests={profile.followRequests}
          onAccept={handleAccept}
          onReject={handleReject}
          onNavigate={(uid) => navigate(`/profile/${uid}`)}
        />
      )}

      {/* Profile Card */}
      <div className={profileCard}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4">
            {profile.profilePic
              ? <img src={profile.profilePic} className="w-20 h-20 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800" alt="" />
              : <div className={`${avatar} w-20 h-20 text-2xl`}>{profile.name?.charAt(0).toUpperCase()}</div>
            }
            <div>
              <h2 className={headingClass}>{profile.name}</h2>
              <p className={mutedText}>@{profile.username}</p>
              {profile.bio && <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] mt-1">{profile.bio}</p>}
              <div className="mt-2">
                {profile.isPrivate
                  ? <span className={badgePrivate}>🔒 Private</span>
                  : <span className={badgePublic}>🌐 Public</span>
                }
              </div>
            </div>
          </div>

          {/* Stats */}
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

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#e4e4e7] dark:border-[#27272a]">
          <button className={secondaryBtn} onClick={() => { setEditMode(v => !v); setShowChangePwd(false); }}>
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
          <button className={secondaryBtn} onClick={togglePrivacy} disabled={privacyLoading}>
            {privacyLoading ? "…" : profile.isPrivate ? "Make Public" : "Make Private"}
          </button>
          <button
            className={secondaryBtn}
            onClick={() => { setShowChangePwd(v => !v); setEditMode(false); }}
          >
            {showChangePwd ? "Cancel" : "🔑 Change Password"}
          </button>
          <button className={dangerBtn} onClick={onLogout}>Logout</button>
        </div>

        {/* Change Password Form */}
        {showChangePwd && (
          <ChangePasswordForm onClose={() => setShowChangePwd(false)} />
        )}

        {/* Edit Form */}
        {editMode && (
          <form onSubmit={handleSubmit(onUpdateProfile)} className="mt-5 pt-5 border-t border-[#e4e4e7] dark:border-[#27272a] flex flex-col gap-3">
            <p className={subHeadingClass}>Edit Profile</p>
            <div className={formGroup}>
              <label className={labelClass}>Name</label>
              <input type="text" className={inputClass} defaultValue={profile.name} {...register("name")} />
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Bio</label>
              <textarea className={textareaClass} rows={2} defaultValue={profile.bio} {...register("bio")} />
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Profile Photo</label>
              <input type="file" accept="image/*"
                className="w-full text-sm text-[#71717a] file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
                {...register("profilePic")}
              />
            </div>
            <button type="submit" className={primaryBtn} disabled={updating}>
              {updating ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>

      {/* Posts Grid */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={subHeadingClass}>My Posts</h3>
        <span className={mutedText}>{posts.length} post{posts.length !== 1 ? "s" : ""}</span>
      </div>

      {posts.length === 0
        ? <p className={emptyStateClass}>No posts yet. Share your first moment!</p>
        : (
          <div className={postGrid}>
            {posts.map(post => (
              <div key={post.postId} className={postCardClass} onClick={() => navigate(`/post/${post.postId}`)}>
                <img src={post.imageUrl} alt="post" className="w-full aspect-square object-cover" />
                <div className={postCardBody}>
                  {post.caption && (
                    <p className={postCaption}>{post.caption.slice(0, 60)}{post.caption.length > 60 ? "…" : ""}</p>
                  )}
                  <p className={postMeta}>
                    <span className="flex items-center gap-1">❤️ {post.likesCount ?? 0}</span>
                    <span className="flex items-center gap-1">💬 {post.commentsCount ?? 0}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Modals */}
      {modal === "followers" && (
        <UserListModal
          title={`Followers (${profile.followers?.length ?? 0})`}
          users={profile.followers}
          onClose={() => setModal(null)}
          onUserClick={uid => navigate(`/profile/${uid}`)}
        />
      )}
      {modal === "following" && (
        <UserListModal
          title={`Following (${profile.following?.length ?? 0})`}
          users={profile.following}
          onClose={() => setModal(null)}
          onUserClick={uid => navigate(`/profile/${uid}`)}
        />
      )}
    </div>
  );
}

export default UserProfile;
