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
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance.js";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (formData) => {
    try {
      setLoading(true);
      setApiError(null);
      const res = await api.post("/user-api/register", formData);
      if (res.status === 201) {
        toast.success("Account created! Please sign in.", { duration: 2500 });
        navigate("/login");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={loadingClass}>Creating your account…</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Logo mark */}
        <div className="flex justify-center mb-5">
          <span className="w-12 h-12 rounded-2xl bg-violet-600 dark:bg-violet-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-200 dark:shadow-none">S</span>
        </div>

        <h2 className={formTitle}>Create an account</h2>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] text-center mb-6">Join SocialApp and start sharing</p>

        {apiError && <p className={`${errorClass} mb-4`}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)} className="flex flex-col gap-1">
          {/* Full Name */}
          <div className={formGroup}>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Your full name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters required" },
              })}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div className={formGroup}>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              className={inputClass}
              placeholder="lowercase_username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters required" },
                pattern: {
                  value: /^[a-z0-9_]+$/,
                  message: "Only lowercase letters, numbers, and underscores",
                },
              })}
            />
            {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Min. 8 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters required" },
              })}
            />
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-[#27272a]" />
          <span className="text-xs text-[#94a3b8]">OR</span>
          <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-[#27272a]" />
        </div>

        <p className={`${mutedText} text-center`}>
          Already have an account?{" "}
          <NavLink to="/login" className={linkClass}>
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
