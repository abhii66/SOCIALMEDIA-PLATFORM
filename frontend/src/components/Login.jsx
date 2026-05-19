import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common.js";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  const { login, currentUser, loading, error, isAuthenticated } = useAuth((state) => state);

  const onUserLogin = (userCred) => {
    hasRedirected.current = false;
    login(userCred);
  };

  useEffect(() => {
    if (isAuthenticated && currentUser && !hasRedirected.current) {
      hasRedirected.current = true;
      if (currentUser.isAdmin) {
        toast.success("Welcome, Admin!", { duration: 2000 });
        navigate("/admin-profile");
      } else {
        toast.success("Welcome back! Redirecting to feed…", { duration: 2000 });
        navigate("/feed");
      }
    }
  }, [isAuthenticated, currentUser]);

  if (loading) {
    return <p className={loadingClass}>Signing in…</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Logo mark */}
        <div className="flex justify-center mb-5">
          <span className="w-12 h-12 rounded-2xl bg-violet-600 dark:bg-violet-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-200 dark:shadow-none">S</span>
        </div>

        <h2 className={formTitle}>Welcome back</h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] text-center mb-6">Sign in to your account to continue</p>

        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)} className="flex flex-col gap-1">
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                validate: (v) => v.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (v) => v.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-[#27272a]" />
          <span className="text-xs text-[#94a3b8]">OR</span>
          <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-[#27272a]" />
        </div>

        <p className={`${mutedText} text-center`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
