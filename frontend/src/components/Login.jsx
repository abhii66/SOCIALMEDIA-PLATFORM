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
        toast.success("Welcome Admin!", { duration: 2000 });
        navigate("/admin-profile");
      } else {
        toast.success("Login successful! Redirecting to feed...", { duration: 2000 });
        navigate("/feed");
      }
    }
  }, [isAuthenticated, currentUser]);

  if (loading) {
    return <p className={loadingClass}>Signing in...</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Sign In</h2>

        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
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
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
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
