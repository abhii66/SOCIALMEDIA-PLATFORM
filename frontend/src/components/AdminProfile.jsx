import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import {
  headingClass,
  mutedText,
  dangerBtn,
  primaryBtn,
  adminTableWrapper,
  adminTable,
  adminTh,
  adminTd,
  badgeActive,
  badgeInactive,
  loadingClass,
  errorClass,
  emptyStateClass,
} from "../styles/common.js";

function AdminProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET /admin-api/users
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // PATCH /admin-api/users — { userId, isUserActive }
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch("/admin-api/users", {
        userId,
        isUserActive: !currentStatus,
      });
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

  return (
    <div className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={headingClass}>Admin Panel</h2>
          <p className={mutedText}>Welcome, {currentUser?.username}</p>
        </div>
        <button className={dangerBtn} onClick={onLogout}>Logout</button>
      </div>

      {/* Users Table */}
      <h3 className="text-base font-semibold text-[#1d1d1f] mb-3">All Users</h3>

      {loading && <p className={loadingClass}>Loading users...</p>}
      {error && <p className={errorClass}>{error}</p>}

      {!loading && users.length === 0 && (
        <p className={emptyStateClass}>No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className={adminTableWrapper}>
          <table className={adminTable}>
            <thead>
              <tr>
                <th className={adminTh}>Name</th>
                <th className={adminTh}>Username</th>
                <th className={adminTh}>Email</th>
                <th className={adminTh}>Status</th>
                <th className={adminTh}>Followers</th>
                <th className={adminTh}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className={adminTd}>{user.name}</td>
                  <td className={adminTd}>@{user.username}</td>
                  <td className={adminTd}>{user.email}</td>
                  <td className={adminTd}>
                    <span className={user.isUserActive ? badgeActive : badgeInactive}>
                      {user.isUserActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className={adminTd}>{user.followers?.length ?? 0}</td>
                  <td className={adminTd}>
                    <button
                      className={user.isUserActive ? dangerBtn : primaryBtn}
                      onClick={() => handleToggleStatus(user._id, user.isUserActive)}
                    >
                      {user.isUserActive ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
