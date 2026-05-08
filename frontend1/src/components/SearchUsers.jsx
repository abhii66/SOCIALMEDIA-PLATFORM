import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import {
  headingClass,
  searchInput,
  searchResultCard,
  avatar,
  mutedText,
  emptyStateClass,
  loadingClass,
} from "../styles/common.js";

function SearchUsers() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim() === "") {
      setUsers([]);
      setMessage("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    // Debounce 300ms before firing the request
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/user-api/search?q=${encodeURIComponent(query.trim())}`);
        setUsers(res.data.payload || []);
        setMessage(res.data.payload?.length === 0 ? "No users found." : "");
      } catch (err) {
        setUsers([]);
        setMessage(err.response?.data?.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="py-10 max-w-xl mx-auto">
      <h2 className={`${headingClass} mb-6`}>Find People</h2>

      <input
        type="text"
        className={searchInput}
        placeholder="Search by name or @username…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {loading && <p className={loadingClass}>Searching…</p>}

      {!loading && message && (
        <p className={emptyStateClass}>{message}</p>
      )}

      {!loading && users.length > 0 && (
        <div className="mt-4 flex flex-col gap-1">
          {users.map((user) => (
            <div
              key={user._id}
              className={searchResultCard}
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className={`${avatar} w-10 h-10 text-sm`}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1d1d1f] truncate">{user.name}</p>
                <p className={`${mutedText} truncate`}>@{user.username}</p>
                {user.bio && (
                  <p className="text-xs text-[#6e6e73] truncate mt-0.5">{user.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchUsers;
