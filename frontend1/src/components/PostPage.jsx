import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import {
  postPageWrapper,
  postAuthorRow,
  postActions,
  likeBtn,
  likedBtn,
  commentInputRow,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUser,
  commentTime,
  commentText,
  commentUserRow,
  replyCard,
  replyText,
  avatar,
  inputClass,
  primaryBtn,
  dangerBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  mutedText,
} from "../styles/common.js";

const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-3 bg-[#fff3f2] dark:bg-[#3a1a18] border border-[#ff3b30]/20 rounded-xl px-4 py-2.5 text-sm">
      <span className="text-[#cc2f26]">Delete this post?</span>
      <button
        className="text-white bg-[#ff3b30] px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#d62c23] transition"
        onClick={onConfirm}
      >
        Delete
      </button>
      <button
        className="text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white text-xs transition"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

// ── Comment Like Button ────────────────────────────────
function CommentLikeBtn({ commentId, postId, initialLikes, currentUserId }) {
  const [likes, setLikes] = useState(initialLikes || []);
  const [loading, setLoading] = useState(false);

  const isLiked = likes.some((l) => (l?._id || l) === currentUserId);

  const toggle = async () => {
    if (loading) return;
    // Optimistic update
    const wasLiked = isLiked;
    setLikes((prev) =>
      wasLiked
        ? prev.filter((l) => (l?._id || l) !== currentUserId)
        : [...prev, currentUserId]
    );
    setLoading(true);
    try {
      await api.put(`/post-api/${postId}/comment/${commentId}/like`);
    } catch {
      // Revert
      setLikes((prev) =>
        wasLiked
          ? [...prev, currentUserId]
          : prev.filter((l) => (l?._id || l) !== currentUserId)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`text-xs flex items-center gap-1 transition-colors ${
        isLiked
          ? "text-[#ff3b30]"
          : "text-[#a1a1a6] dark:text-[#6e6e73] hover:text-[#ff3b30]"
      }`}
    >
      {isLiked ? "♥" : "♡"} {likes.length > 0 ? likes.length : ""}
    </button>
  );
}

// ── Reply Like Button ──────────────────────────────────
function ReplyLikeBtn({ commentId, postId, replyId, initialLikes, currentUserId }) {
  const [likes, setLikes] = useState(initialLikes || []);
  const [loading, setLoading] = useState(false);

  const isLiked = likes.some((l) => (l?._id || l) === currentUserId);

  const toggle = async () => {
    if (loading) return;
    const wasLiked = isLiked;
    setLikes((prev) =>
      wasLiked
        ? prev.filter((l) => (l?._id || l) !== currentUserId)
        : [...prev, currentUserId]
    );
    setLoading(true);
    try {
      await api.put(`/post-api/${postId}/comment/${commentId}/reply/${replyId}/like`);
    } catch {
      setLikes((prev) =>
        wasLiked
          ? [...prev, currentUserId]
          : prev.filter((l) => (l?._id || l) !== currentUserId)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`text-xs flex items-center gap-1 transition-colors ${
        isLiked
          ? "text-[#ff3b30]"
          : "text-[#a1a1a6] dark:text-[#6e6e73] hover:text-[#ff3b30]"
      }`}
    >
      {isLiked ? "♥" : "♡"} {likes.length > 0 ? likes.length : ""}
    </button>
  );
}

// ── Single Comment with replies ────────────────────────
function Comment({ c, postId, currentUser, onDelete, navigate }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(c.replies || []);
  const [sendingReply, setSendingReply] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await api.post(`/post-api/${postId}/comment/${c._id}/reply`, {
        text: replyText.trim(),
      });
      setReplies((prev) => [...prev, res.data.payload]);
      setReplyText("");
      setShowReplies(true);
      setShowReplyInput(false);
      toast.success("Reply added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add reply");
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className={commentCard}>
      {/* Comment header */}
      <div className={commentHeader}>
        <div className={commentUserRow}>
          {c.author?.profilePic ? (
            <img
              src={c.author.profilePic}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt=""
              onClick={() => navigate(`/profile/${c.author._id}`)}
            />
          ) : (
            <div
              className={`${avatar} w-8 h-8 text-xs cursor-pointer`}
              onClick={() => navigate(`/profile/${c.author?._id}`)}
            >
              {c.author?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className={`${commentUser} cursor-pointer hover:underline`} onClick={() => navigate(`/profile/${c.author?._id}`)}>
              {c.author?.name}
            </p>
            <p className="text-[10px] text-[#a1a1a6]">@{c.author?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className={commentTime}>{formatDate(c.createdAt)}</p>
          {c.author?._id === currentUser?._id && (
            <button
              className="text-[#ff3b30] text-xs hover:underline"
              onClick={() => onDelete(c._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Comment text */}
      <p className="text-[#1d1d1f] dark:text-[#e5e5ea] text-sm leading-relaxed mt-1">{c.text}</p>

      {/* Comment actions */}
      <div className="flex items-center gap-4 mt-2">
        <CommentLikeBtn
          commentId={c._id}
          postId={postId}
          initialLikes={c.likes || []}
          currentUserId={currentUser?._id}
        />
        <button
          className="text-xs text-[#a1a1a6] dark:text-[#6e6e73] hover:text-[#0066cc] dark:hover:text-[#3399ff] transition-colors"
          onClick={() => setShowReplyInput((v) => !v)}
        >
          Reply
        </button>
        {replies.length > 0 && (
          <button
            className="text-xs text-[#0066cc] dark:text-[#3399ff] hover:underline"
            onClick={() => setShowReplies((v) => !v)}
          >
            {showReplies ? "Hide" : `View`} {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Reply input */}
      {showReplyInput && (
        <div className="flex gap-2 mt-2 ml-10 ">
          <input
            type="text"
            className={`${inputClass} text-xs py-1.5`}
            placeholder="Write a reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReply()}
          />
          <button
            className="text-xs bg-[#0066cc] dark:bg-[#3399ff] text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#004499] transition"
            onClick={handleReply}
            disabled={sendingReply}
          >
            {sendingReply ? "…" : "Post"}
          </button>
        </div>
      )}

      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {replies.map((r) => (
            <div key={r._id} className={replyCard}>
              <div className="flex items-center justify-between">
                <div className={commentUserRow}>
                  {r.author?.profilePic ? (
                    <img src={r.author.profilePic} className="w-6 h-6 rounded-full object-cover" alt="" />
                  ) : (
                    <div className={`${avatar} w-6 h-6 text-[10px]`}>
                      {r.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-[#1d1d1f] dark:text-white">{r.author?.name}</p>
                    <p className="text-[9px] text-[#a1a1a6]">@{r.author?.username}</p>
                  </div>
                </div>
                <p className="text-[9px] text-[#a1a1a6]">{formatDate(r.createdAt)}</p>
              </div>
              <p className="text-[#1d1d1f] dark:text-[#e5e5ea] text-sm leading-relaxed mt-1">{r.text}</p>
              <div className="mt-1">
                <ReplyLikeBtn
                  commentId={c._id}
                  postId={postId}
                  replyId={r._id}
                  initialLikes={r.likes || []}
                  currentUserId={currentUser?._id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main PostPage ──────────────────────────────────────
function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isLiked = post?.likes?.some(
    (l) => l === currentUser?._id || l?._id === currentUser?._id
  );
  const isMyPost = post?.author?._id === currentUser?._id;

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/post-api/${id}`);
        setPost(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/post-api/${id}/comments`);
        setComments(res.data.payload);
      } catch { /* non-critical */ }
    };
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (liking) return;
    const wasLiked = isLiked;
    setPost((prev) => {
      if (!prev) return prev;
      const newLikes = wasLiked
        ? prev.likes.filter((l) => (l?._id || l) !== currentUser?._id)
        : [...prev.likes, currentUser?._id];
      return { ...prev, likes: newLikes };
    });
    setLiking(true);
    try {
      await api.put(`/post-api/${id}/like`);
      const res = await api.get(`/post-api/${id}`);
      setPost(res.data.payload);
    } catch (err) {
      setPost((prev) => {
        if (!prev) return prev;
        const rolledBack = wasLiked
          ? [...prev.likes, currentUser?._id]
          : prev.likes.filter((l) => (l?._id || l) !== currentUser?._id);
        return { ...prev, likes: rolledBack };
      });
      toast.error(err.response?.data?.message || "Could not update like");
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    setCommenting(true);
    try {
      await api.put(`/post-api/${id}/comment`, { text: commentInput.trim() });
      setCommentInput("");
      const res = await api.get(`/post-api/${id}/comments`);
      setComments(res.data.payload);
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add comment");
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/post-api/${id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete comment");
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/post-api/${id}`);
      toast.success("Post deleted");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete post");
    }
  };

  if (loading) return <p className={loadingClass}>Loading post...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!post) return null;

  return (
    <div className={postPageWrapper}>
      {/* Image */}
      <div className="rounded-2xl overflow-hidden mb-4">
        <img src={post.imageUrl} alt="post" className="w-full object-cover max-h-[500px]" />
      </div>

      {/* Author row */}
      <div className={postAuthorRow}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?._id}`)}
        >
          {post.author?.profilePic ? (
            <img src={post.author.profilePic} className="w-9 h-9 rounded-full object-cover" alt="" />
          ) : (
            <div className={avatar}>{post.author?.name?.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{post.author?.name}</p>
            <p className={mutedText}>@{post.author?.username}</p>
          </div>
        </div>
        <p className={mutedText}>{formatDate(post.createdAt)}</p>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-[#1d1d1f] dark:text-[#e5e5ea] text-sm leading-relaxed mt-3 mb-2">{post.caption}</p>
      )}

      {/* Actions */}
      <div className={postActions}>
        <button
          className={isLiked ? likedBtn : likeBtn}
          onClick={handleLike}
          disabled={liking}
        >
          {isLiked ? "♥" : "♡"} {post.likes?.length ?? 0}
        </button>
        <span className="text-sm text-[#6e6e73] dark:text-[#98989d]">💬 {comments.length}</span>

        {isMyPost && !confirmDelete && (
          <button className={dangerBtn} onClick={() => setConfirmDelete(true)}>
            Delete Post
          </button>
        )}
      </div>

      {isMyPost && confirmDelete && (
        <div className="mt-3">
          <DeleteConfirm
            onConfirm={handleDeletePost}
            onCancel={() => setConfirmDelete(false)}
          />
        </div>
      )}

      {/* Comment input — only for non-owners */}
      {!isMyPost && (
        <div className={commentInputRow}>
          <input
            type="text"
            className={inputClass}
            placeholder="Add a comment…"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <button className={primaryBtn} onClick={handleComment} disabled={commenting}>
            Post
          </button>
        </div>
      )}

      {/* Comments list */}
      <div className={commentsWrapper}>
        {comments.length === 0 ? (
          <p className={emptyStateClass}>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <Comment
              key={c._id}
              c={c}
              postId={id}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PostPage;
