import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import {
  postGrid,
  postCardClass,
  postCardBody,
  postCaption,
  postMeta,
  avatar,
  errorClass,
  emptyStateClass,
  headingClass,
} from "../styles/common.js";

// Skeleton placeholder for a single post card
function PostSkeleton() {
  return (
    <div className="bg-[#f5f5f7] rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-[#e0e0e5]" />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#d2d2d7]" />
          <div className="h-3 w-24 bg-[#d2d2d7] rounded-full" />
        </div>
        <div className="h-3 w-full bg-[#d2d2d7] rounded-full" />
        <div className="h-3 w-16 bg-[#d2d2d7] rounded-full" />
      </div>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const res = await api.get("/feed-api/");
        if (res.status === 200) {
          setPosts(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (error) return <p className={`${errorClass} mt-10`}>{error}</p>;

  return (
    <div className="py-10">
      <h2 className={`${headingClass} mb-6`}>Your Feed</h2>

      {loading ? (
        <div className={postGrid}>
          {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <p className={emptyStateClass}>
          No posts yet. Follow some users or check out{" "}
          <span
            className="text-[#0066cc] cursor-pointer"
            onClick={() => navigate("/explore")}
          >
            Explore
          </span>.
        </p>
      ) : (
        <div className={postGrid}>
          {posts.map((post) => (
            <div
              key={post._id}
              className={postCardClass}
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <img
                src={post.imageUrl}
                alt="post"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              <div className={postCardBody}>
                <div className="flex items-center gap-2">
                  {post.author?.profilePic ? (
                    <img
                      src={post.author.profilePic}
                      className="w-7 h-7 rounded-full object-cover"
                      alt={post.author.username}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`${avatar} w-7 h-7 text-xs`}>
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#1d1d1f]">
                    {post.author?.username}
                  </span>
                </div>
                {post.caption && (
                  <p className={postCaption}>
                    {post.caption.slice(0, 80)}{post.caption.length > 80 ? "…" : ""}
                  </p>
                )}
                <p className={postMeta}>
                  <span>♥ {post.likes?.length ?? 0}</span>
                  <span>💬 {post.comments?.length ?? 0}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
