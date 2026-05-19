import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import {
  profileCard, profileStat, profileStatNumber, profileStatLabel,
  followBtn, unfollowBtn, requestedBtn,
  loadingClass, errorClass, emptyStateClass,
  headingClass, mutedText, avatar,
  modalOverlay, modalBox, modalHeader, modalTitle, modalBody,
  searchResultCard, badgePrivate,
} from "../styles/common.js";

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

function OtherUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [followLoading, setFollowL]   = useState(false);
  const [modal, setModal]             = useState(null);

  // _followStatus: 'none' | 'requested' | 'following' | 'self'
  const followStatus = profile?._followStatus ?? "none";
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
    if (id === currentUser?._id) { navigate("/profile"); return; }
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    setFollowL(true);
    try {
      const res = await api.put(`/user-api/follow/${id}`);
      toast.success(res.data.message);
      setProfile(prev => ({ ...prev, _followStatus: res.data.status }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not follow");
    } finally {
      setFollowL(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowL(true);
    try {
      const res = await api.put(`/user-api/unfollow/${id}`);
      toast.success(res.data.message);
      fetchProfile();        // refresh full profile to update counts
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not unfollow");
    } finally {
      setFollowL(false);
    }
  };

  if (loading) return <p className={loadingClass}>Loading profile…</p>;
  if (error)   return <p className={errorClass}>{error}</p>;
  if (!profile) return null;

  // ── Follow Button logic ─────────────────────────────
  const FollowControl = () => {
    if (followStatus === "following") {
      return (
        <button className={unfollowBtn} onClick={handleUnfollow} disabled={followLoading}>
          {followLoading ? "…" : "Following ✓"}
        </button>
      );
    }
    if (followStatus === "requested") {
      return (
        <button className={requestedBtn} onClick={handleUnfollow} disabled={followLoading} title="Click to cancel request">
          {followLoading ? "…" : "⏳ Requested · Cancel"}
        </button>
      );
    }
    return (
      <button className={followBtn} onClick={handleFollow} disabled={followLoading}>
        {followLoading ? "…" : "Follow"}
      </button>
    );
  };

  return (
    <div className="py-8">
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
              {isPrivateView && <span className={`mt-2 ${badgePrivate}`}>🔒 Private Account</span>}
            </div>
          </div>

          {/* Stats — hidden for private accounts where user hasn't been accepted */}
          <div className="flex gap-6">
            <div
              className={profileStat}
              onClick={() => !isPrivateView && profile.followers && setModal("followers")}
            >
              <span className={profileStatNumber}>{isPrivateView ? "—" : (profile.followers?.length ?? 0)}</span>
              <span className={profileStatLabel}>Followers</span>
            </div>
            <div
              className={profileStat}
              onClick={() => !isPrivateView && profile.following && setModal("following")}
            >
              <span className={profileStatNumber}>{isPrivateView ? "—" : (profile.following?.length ?? 0)}</span>
              <span className={profileStatLabel}>Following</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-[#e4e4e7] dark:border-[#27272a]">
          <FollowControl />
        </div>
      </div>

      {/* Private lock screen */}
      {isPrivateView ? (
        <div className="text-center py-16 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-2xl">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
          <p className="font-bold text-[#18181b] dark:text-white text-lg mb-1">This account is private</p>
          <p className="text-[#a1a1aa] text-sm mb-4">
            {followStatus === "requested"
              ? "Your follow request is pending. Once accepted, you'll see their posts."
              : "Follow this account to see their photos and posts."
            }
          </p>
          {followStatus === "none" && (
            <button className={followBtn} onClick={handleFollow} disabled={followLoading}>
              {followLoading ? "…" : "Request to Follow"}
            </button>
          )}
          {followStatus === "requested" && (
            <button className={requestedBtn} onClick={handleUnfollow} disabled={followLoading}>
              {followLoading ? "…" : "Cancel Request"}
            </button>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-[#a1a1aa] py-8">
          Browse{" "}
          <span
            className="text-violet-600 dark:text-violet-400 cursor-pointer hover:underline font-medium"
            onClick={() => navigate("/explore")}
          >
            Explore
          </span>{" "}
          to see posts from this user.
        </p>
      )}

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

export default OtherUserProfile;
