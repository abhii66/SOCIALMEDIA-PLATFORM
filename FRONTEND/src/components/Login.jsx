import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/authStore'

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 192 192" fill="none">
    <path d="M141.537 88.988C140.31 88.388 139.051 87.823 137.763 87.296C135.327 60.525 120.061 45.393 96.27 45.245C96.183 45.244 96.096 45.244 96.009 45.244C81.771 45.244 69.787 51.565 62.099 62.834L75.916 72.47C81.576 64.183 90.461 59.77 96.009 59.77C108.126 59.848 117.245 67.07 120.76 79.015C118.208 78.604 115.564 78.38 112.842 78.38C88.52 78.38 71.972 92.73 71.972 114.147C71.972 136.113 89.085 149.5 112.842 149.5C140.193 149.5 156.372 133.208 156.372 108.007C156.372 99.516 154.264 92.107 141.537 88.988ZM112.842 135.068C98.721 135.068 86.399 128.014 86.399 114.147C86.399 100.835 97.647 92.807 112.842 92.807C127.678 92.807 138.622 99.747 138.622 114.147C138.622 128.546 127.306 135.068 112.842 135.068Z" fill="currentColor"/>
    <path d="M96 192C148.975 192 192 148.975 192 96C192 43.025 148.975 0 96 0C43.025 0 0 43.025 0 96C0 148.975 43.025 192 96 192ZM96 15C140.735 15 177 51.265 177 96C177 140.735 140.735 177 96 177C51.265 177 15 140.735 15 96C15 51.265 51.265 15 96 15Z" fill="currentColor"/>
  </svg>
)

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

function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [idFocused, setIdFocused] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) return

    const success = await login({ idCreds: identifier, password })
    if(success) navigate("/app/foryou")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .login-card { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .shake { animation: shake 0.4s ease; }
        ::placeholder { color: #ccc; }
      `}</style>

      <div className="login-card" style={{
        width: "100%", maxWidth: 400,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 24, padding: "40px 32px 32px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ color: "#000", display: "inline-block", marginBottom: 16 }}>
            <Logo />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000", margin: "0 0 6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Log in to continue</p>
        </div>

        {/* Identifier */}
        <div style={{ marginBottom: 14, animation: "fadeUp 0.5s 0.1s both" }}>
          <div style={{
            display: "flex", alignItems: "center",
            border: idFocused ? "1.5px solid #000" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 12, padding: "0 14px", height: 50,
            transition: "border 0.2s",
            background: idFocused ? "#fff" : "#fafafa",
          }}>
            <input
              type="text"
              placeholder="Username or email"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              onFocus={() => setIdFocused(true)}
              onBlur={() => setIdFocused(false)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 15, color: "#000",
                background: "transparent", fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20, animation: "fadeUp 0.5s 0.15s both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            border: pwFocused ? "1.5px solid #000" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 12, padding: "0 14px", height: 50,
            transition: "border 0.2s",
            background: pwFocused ? "#fff" : "#fafafa",
          }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 15, color: "#000",
                background: "transparent", fontFamily: "inherit",
              }}
            />
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
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="shake" style={{
            background: "#fff5f5", border: "1px solid #fecaca",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 13, color: "#e05454",
            marginBottom: 16, textAlign: "center",
          }}>
            {error}
            {error.includes("Incorrect") && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: "#aaa" }}>Don't have an account? </span>
                <span
                  onClick={() => navigate("/register")}
                  style={{ color: "#000", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                >
                  Sign up
                </span>
              </div>
            )}
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", height: 50, borderRadius: 12, border: "none",
            background: loading ? "#ddd" : "#000",
            color: loading ? "#aaa" : "#fff",
            fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
            marginBottom: 20, animation: "fadeUp 0.5s 0.2s both",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#222" }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#000" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 20, animation: "fadeUp 0.5s 0.25s both",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 13, color: "#ccc" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#aaa", margin: 0, animation: "fadeUp 0.5s 0.3s both" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#000", fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline" }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = "none" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login