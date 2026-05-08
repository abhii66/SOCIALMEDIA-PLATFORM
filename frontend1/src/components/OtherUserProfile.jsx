import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import {
  profileCard,
  profileStat,
  profileStatNumber,
  profileStatLabel,
  followBtn,
  unfollowBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  headingClass,
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
          {!users || users.length === 0 ? (
            <p className="text-center text-[#a1a1a6] text-sm py-6">Nothing here yet.</p>
          ) : (
            users.map((u) => (
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

function OtherUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [modal, setModal] = useState(null); // "followers" | "following"

  const isFollowing = profile?.followers?.some(
    (f) => f === currentUser?._id || f?._id === currentUser?._id
  );

  // Private account: followers/following are null from backend
  const isPrivateView = profile?._isPrivateView;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user-api/profile/${id}`);
      setProfile(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id === currentUser?._id) {
      navigate("/profile");
      return;
    }
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await api.put(`/user-api/follow/${id}`);
      toast.success("Following!");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      await api.put(`/user-api/unfollow/${id}`);
      toast.success("Unfollowed");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not unfollow");
    } finally {
      setFollowLoading(false);
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
              {isPrivateView && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ff9500]/15 text-[#c96300]">
                  🔒 Private Account
                </span>
              )}
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex gap-6">
            {/* Followers — clickable only for public profiles */}
            <div
              className={profileStat}
              onClick={() => !isPrivateView && profile.followers && setModal("followers")}
            >
              <span className={profileStatNumber}>
                {isPrivateView ? "—" : (profile.followers?.length ?? 0)}
              </span>
              <span className={profileStatLabel}>Followers</span>
            </div>
            <div
              className={profileStat}
              onClick={() => !isPrivateView && profile.following && setModal("following")}
            >
              <span className={profileStatNumber}>
                {isPrivateView ? "—" : (profile.following?.length ?? 0)}
              </span>
              <span className={profileStatLabel}>Following</span>
            </div>
          </div>
        </div>

        {/* Follow / Unfollow */}
        <div className="mt-5">
          {isFollowing ? (
            <button className={unfollowBtn} onClick={handleUnfollow} disabled={followLoading}>
              {followLoading ? "…" : "Unfollow"}
            </button>
          ) : (
            <button className={followBtn} onClick={handleFollow} disabled={followLoading}>
              {followLoading ? "…" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Private account message */}
      {isPrivateView ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-[#1d1d1f] dark:text-white font-semibold text-lg mb-1">This account is private</p>
          <p className="text-[#a1a1a6] text-sm">Follow this account to see their posts.</p>
        </div>
      ) : (
        <p className={`${mutedText} text-center py-6`}>
          Check{" "}
          <span
            className="text-[#0066cc] dark:text-[#3399ff] cursor-pointer hover:underline"
            onClick={() => navigate("/explore")}
          >
            Explore
          </span>{" "}
          to see posts from this user.
        </p>
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

export default OtherUserProfile;
