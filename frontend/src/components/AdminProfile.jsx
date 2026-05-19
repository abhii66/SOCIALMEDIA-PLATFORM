import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import {
  headingClass,
  subHeadingClass,
  mutedText,
  dangerBtn,
  primaryBtn,
  secondaryBtn,
  adminTableWrapper,
  adminTable,
  adminTh,
  adminTd,
  badgeActive,
  badgeInactive,
  loadingClass,
  errorClass,
  emptyStateClass,
  avatar,
} from "../styles/common.js";

function StatCard({ label, value, color = "violet" }) {
  const colors = {
    violet: "bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30",
    emerald: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    rose:    "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
  };
  return (
    <div className={`border rounded-2xl px-5 py-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider mt-0.5 opacity-70">{label}</p>
    </div>
  );
}

function AdminProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin-api/users");
      setUsers(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch("/admin-api/users", { userId, isUserActive: !currentStatus });
      toast.success(`User ${!currentStatus ? "activated" : "blocked"}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filtered = users.filter(u =>
    !search.trim() ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount  = users.filter(u => u.isUserActive).length;
  const blockedCount = users.filter(u => !u.isUserActive).length;

  return (
    <div className="py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-lg">A</div>
          <div>
            <h2 className={headingClass}>Admin Panel</h2>
            <p className={mutedText}>Logged in as @{currentUser?.username}</p>
          </div>
        </div>
        <button className={dangerBtn} onClick={onLogout}>Sign Out</button>
      </div>

      {/* Stats */}
      {!loading && users.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Total Users"   value={users.length} color="violet" />
          <StatCard label="Active"        value={activeCount}  color="emerald" />
          <StatCard label="Blocked"       value={blockedCount} color="rose" />
        </div>
      )}

      {/* Users Table */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className={subHeadingClass}>All Users</h3>
        {users.length > 0 && (
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, username or email…"
            className="bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition w-64 text-[#0f172a] dark:text-white placeholder:text-[#94a3b8]"
          />
        )}
      </div>

      {loading && <p className={loadingClass}>Loading users…</p>}
      {error   && <p className={errorClass}>{error}</p>}

      {!loading && users.length === 0 && (
        <p className={emptyStateClass}>No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className={adminTableWrapper}>
          <table className={adminTable}>
            <thead>
              <tr>
                <th className={adminTh}>User</th>
                <th className={adminTh}>Email</th>
                <th className={adminTh}>Status</th>
                <th className={adminTh}>Followers</th>
                <th className={adminTh}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#94a3b8] text-sm">No users match your search.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1f1f23] transition-colors">
                    <td className={adminTd}>
                      <div className="flex items-center gap-2.5">
                        {user.profilePic
                          ? <img src={user.profilePic} className="w-8 h-8 rounded-full object-cover" alt="" />
                          : <div className={`${avatar} w-8 h-8 text-xs`}>{user.name?.charAt(0).toUpperCase()}</div>
                        }
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a] dark:text-white leading-tight">{user.name}</p>
                          <p className="text-[11px] text-[#94a3b8]">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className={adminTd}>
                      <span className="text-[#64748b] dark:text-[#94a3b8]">{user.email}</span>
                    </td>
                    <td className={adminTd}>
                      <span className={user.isUserActive ? badgeActive : badgeInactive}>
                        {user.isUserActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className={adminTd}>
                      <span className="font-semibold text-[#0f172a] dark:text-white">{user.followers?.length ?? 0}</span>
                    </td>
                    <td className={adminTd}>
                      <button
                        className={user.isUserActive ? dangerBtn : primaryBtn}
                        onClick={() => handleToggleStatus(user._id, user.isUserActive)}
                      >
                        {user.isUserActive ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
