
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore' 
import axios from 'axios'


// ── Logo ───────────────────────────────────
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 192 192" fill="none">
    <path d="M141.537 88.988C140.31 88.388 139.051 87.823 137.763 87.296C135.327 60.525 120.061 45.393 96.27 45.245C96.183 45.244 96.096 45.244 96.009 45.244C81.771 45.244 69.787 51.565 62.099 62.834L75.916 72.47C81.576 64.183 90.461 59.77 96.009 59.77C108.126 59.848 117.245 67.07 120.76 79.015C118.208 78.604 115.564 78.38 112.842 78.38C88.52 78.38 71.972 92.73 71.972 114.147C71.972 136.113 89.085 149.5 112.842 149.5C140.193 149.5 156.372 133.208 156.372 108.007C156.372 99.516 154.264 92.107 141.537 88.988ZM112.842 135.068C98.721 135.068 86.399 128.014 86.399 114.147C86.399 100.835 97.647 92.807 112.842 92.807C127.678 92.807 138.622 99.747 138.622 114.147C138.622 128.546 127.306 135.068 112.842 135.068Z" fill="currentColor"/>
    <path d="M96 192C148.975 192 192 148.975 192 96C192 43.025 148.975 0 96 0C43.025 0 0 43.025 0 96C0 148.975 43.025 192 96 192ZM96 15C140.735 15 177 51.265 177 96C177 140.735 140.735 177 96 177C51.265 177 15 140.735 15 96C15 51.265 51.265 15 96 15Z" fill="currentColor"/>
  </svg>
)

// ── Eye Icons ──────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

// ── Camera Icon ────────────────────────────
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
)

// ── Profile Image Picker ───────────────────
function ProfileImagePicker({ value, onChange, error }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      onChange(null, "Please select a valid image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onChange(null, "Image must be smaller than 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange({ file, preview: e.target.result }, null)
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => handleFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onChange(null, null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      {/* Avatar circle */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          position: "relative",
          width: 88,
          height: 88,
          borderRadius: "50%",
          cursor: "pointer",
          border: dragOver
            ? "2px dashed #000"
            : error
            ? "2px dashed #e05454"
            : value?.preview
            ? "2px solid #000"
            : "2px dashed rgba(0,0,0,0.18)",
          background: dragOver ? "#f5f5f5" : value?.preview ? "transparent" : "#fafafa",
          transition: "all 0.2s",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {value?.preview ? (
          /* Preview image */
          <img
            src={value.preview}
            alt="Profile preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          /* Placeholder */
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 4,
            color: error ? "#e05454" : "#bbb",
          }}>
            <CameraIcon />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.2 }}>PHOTO</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="avatar-overlay"
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
            opacity: 0,
            transition: "opacity 0.2s",
            color: "#fff",
          }}
        >
          <CameraIcon />
        </div>
      </div>

      {/* Remove button (only when image selected) */}
      {value?.preview && (
        <button
          onClick={handleRemove}
          style={{
            marginTop: 8,
            background: "none", border: "none",
            fontSize: 12, color: "#aaa",
            cursor: "pointer", fontFamily: "inherit",
            padding: "2px 8px",
            borderRadius: 6,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#e05454"}
          onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
        >
          Remove
        </button>
      )}

      {/* Label / error */}
      {error ? (
        <p style={{ ...errorStyle, marginTop: 6, textAlign: "center" }}>{error}</p>
      ) : (
        <p style={{ fontSize: 12, color: "#bbb", margin: "8px 0 0", textAlign: "center" }}>
          {value?.preview ? value.file.name : "Click or drag to upload · Max 5MB"}
        </p>
      )}

      <style>{`
        div:hover > .avatar-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  )
}

// ── Input Field Component ──────────────────
function InputField({ placeholder, value, onChange, type = "text", rightElement, onKeyDown }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      border: focused ? "1.5px solid #000" : "1.5px solid rgba(0,0,0,0.1)",
      borderRadius: 12,
      padding: "0 14px",
      height: 50,
      transition: "border 0.2s, background 0.2s",
      background: focused ? "#fff" : "#fafafa",
    }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        style={{
          flex: 1, border: "none", outline: "none",
          fontSize: 15, color: "#000",
          background: "transparent", fontFamily: "inherit",
        }}
      />
      {rightElement}
    </div>
  )
}

// ── Register Component ─────────────────────
function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    userName:  "",
    email:     "",
    password:  "",
  })
  const [profileImage, setProfileImage] = useState(null) // { file, preview } | null
  const [showPass, setShowPass]         = useState(false)
  const [errors, setErrors]             = useState({})
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: "" }))
  }

  const handleImageChange = (imageData, imageError) => {
    setProfileImage(imageData)
    setErrors(er => ({ ...er, profileImage: imageError || "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim())  newErrors.lastName  = "Last name is required"
    if (!form.userName.trim())  newErrors.userName  = "Username is required"
    else if (form.userName.includes(" ")) newErrors.userName = "Username cannot have spaces"
    if (!form.email.trim())     newErrors.email     = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email"
    if (!form.password.trim())  newErrors.password  = "Password is required"
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    return newErrors
  }

  const handleRegister = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    try {
      // Build multipart form data so the image file is included
      const formData = new FormData()
      formData.append("firstName", form.firstName)
      formData.append("lastName",  form.lastName)
      formData.append("userName",  form.userName)
      formData.append("email",     form.email)
      formData.append("password",  form.password)
      if (profileImage?.file) {
        // Field name must match upload.single("profileImageUrl") in the backend
        formData.append("profileImageUrl", profileImage.file)
      }

      const success = await register(formData)
      if(success){
      setSuccess(true)
      setTimeout(() => navigate("/"), 1500)
      } else {
      setErrors({ api: "Registration failed. Please try again." })
      }

      setSuccess(true)
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      setErrors({ api: err?.response?.data?.message || "Registration failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister()
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0%   { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        .register-card { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        ::placeholder  { color: #ccc; }
      `}</style>

      <div
        className="register-card"
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 24,
          padding: "40px 32px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0", animation: "pop 0.4s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000", margin: "0 0 8px" }}>Account created!</h2>
            <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Redirecting to login...</p>
          </div>
        ) : (
          <>
            {/* Logo + Title */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ color: "#000", display: "inline-block", marginBottom: 14 }}>
                <Logo />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000", margin: "0 0 6px" }}>
                Create account
              </h1>
              <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>
                Join and start sharing
              </p>
            </div>

            {/* ── Profile Image Picker ── */}
            <ProfileImagePicker
              value={profileImage}
              onChange={handleImageChange}
              error={errors.profileImage}
            />

            {/* First + Last name row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <InputField
                  placeholder="First name"
                  value={form.firstName}
                  onChange={update("firstName")}
                  onKeyDown={handleKeyDown}
                />
                {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <InputField
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={update("lastName")}
                  onKeyDown={handleKeyDown}
                />
                {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: 12 }}>
              <InputField
                placeholder="Username"
                value={form.userName}
                onChange={update("userName")}
                onKeyDown={handleKeyDown}
              />
              {errors.userName && <p style={errorStyle}>{errors.userName}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <InputField
                placeholder="Email"
                value={form.email}
                onChange={update("email")}
                type="email"
                onKeyDown={handleKeyDown}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <InputField
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={update("password")}
                type={showPass ? "text" : "password"}
                onKeyDown={handleKeyDown}
                rightElement={
                  <button
                    onClick={() => setShowPass(s => !s)}
                    style={{
                      background: "none", border: "none",
                      color: "#aaa", cursor: "pointer",
                      display: "flex", alignItems: "center", padding: 0,
                    }}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            {/* API-level error */}
            {errors.api && (
              <p style={{ ...errorStyle, textAlign: "center", marginBottom: 12, fontSize: 13 }}>
                {errors.api}
              </p>
            )}

            {/* Register button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: "100%", height: 50,
                borderRadius: 12, border: "none",
                background: loading ? "#ddd" : "#000",
                color: loading ? "#aaa" : "#fff",
                fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                marginBottom: 20,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#222" }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#000" }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: 13, color: "#ccc" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
            </div>

            {/* Login link */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#aaa", margin: 0 }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                style={{ color: "#000", fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline" }}
                onMouseLeave={e => { e.currentTarget.style.textDecoration = "none" }}
              >
                Log in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ── Error text style ───────────────────────
const errorStyle = {
  fontSize: 12,
  color: "#e05454",
  margin: "4px 0 0 4px",
}

export default Register