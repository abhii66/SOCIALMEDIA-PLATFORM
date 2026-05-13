import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const EditProfile = () => {
const navigate=useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const initials =
    `${form.firstName[0] || ""}${form.lastName[0] || ""}`.toUpperCase() || "U";

  const handleChange = (field) =>  (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    setSaved(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
  };

const validate = () => {
  const errs = {};
  
  const hasTextInput = form.firstName.trim() || form.lastName.trim() || form.userName.trim() || form.bio.trim();
  const hasImage = fileRef.current?.files[0];
  if (!hasTextInput && !hasImage) {
    errs.general = "Please fill at least one field";
  }
  if (form.userName && form.userName.includes(" ")) 
    errs.userName = "No spaces allowed";
  return errs;
};

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const formData = new FormData()
    if (form.firstName.trim()) formData.append("firstName", form.firstName)
    if (form.lastName.trim())  formData.append("lastName",  form.lastName)
    if (form.userName.trim())  formData.append("userName", form.userName)
    if (form.bio.trim())       formData.append("bio", form.bio)

    if (fileRef.current?.files[0]) {
      formData.append("profileImageUrl", fileRef.current.files[0])
    }

    const res = await axios.put(
        "http://localhost:2167/user-api/users/update-profile",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" }}
    )
    if(res.status === 200){
        setSaved(true)
        setTimeout(() => navigate(-1), 1500)
    }
};

  const inputStyle = (field) => ({
    width: "100%",
    background: "none",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: errors[field] ? "#E24B4A" : "#000",
    fontFamily: "inherit",
    padding: 0,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .ep-root {
          --bg: #ffffff;
          --surface: #f5f5f5;
          --border: rgba(0,0,0,0.1);
          --text: #000000;
          --muted: #999999;
          --error: #E24B4A;
          --success: #1a7a3a;
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px 16px;
        }
        .ep-card {
          width: 100%;
          max-width: 420px;
        }
        .ep-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          position: relative;
        }
        .ep-topbar-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .ep-btn-cancel {
          background: none;
          border: none;
          font-size: 15px;
          color: var(--muted);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }
        .ep-btn-cancel:hover { color: var(--text); }
        .ep-btn-save {
          background: #000;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 8px 18px;
          border-radius: 20px;
          transition: opacity 0.15s;
        }
        .ep-btn-save:hover { opacity: 0.75; }
        .ep-btn-save.saved {
          background: #e6f4ed;
          color: var(--success);
        }
        .ep-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .ep-avatar-ring {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 2px solid var(--border);
          padding: 2px;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s;
        }
        .ep-avatar-ring:hover { border-color: rgba(0,0,0,0.3); }
        .ep-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #d0d0d0 0%, #b0b0b0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          position: relative;
        }
        .ep-avatar-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }
        .ep-avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ep-avatar-ring:hover .ep-avatar-overlay { opacity: 1; }
        .ep-avatar-overlay svg { width: 22px; height: 22px; stroke: #fff; }
        .ep-edit-photo {
          font-size: 14px;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .ep-edit-photo:hover { color: var(--text); }
        .ep-section-label {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 0 4px;
          margin-bottom: 8px;
          margin-top: 4px;
        }
        .ep-field-group {
          background: var(--surface);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .ep-row {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          gap: 14px;
        }
        .ep-row + .ep-row {
          border-top: 0.5px solid var(--border);
        }
        .ep-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          width: 100px;
          flex-shrink: 0;
        }
        .ep-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .ep-textarea {
          width: 100%;
          background: none;
          border: none;
          outline: none;
          font-size: 15px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          resize: none;
          line-height: 1.5;
          padding: 0;
        }
        .ep-char-count {
          font-size: 11px;
          color: var(--muted);
          text-align: right;
          padding: 0 16px 10px;
          margin: 0;
        }
        .ep-error-text {
          font-size: 11px;
          color: var(--error);
          padding: 0 16px 10px;
          margin-top: -6px;
        }
        .ep-save-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #e6f4ed;
          border: 0.5px solid rgba(26,122,58,0.25);
          border-radius: 12px;
          margin-top: 16px;
        }
        .ep-save-banner span { font-size: 14px; color: var(--success); }
        .ep-save-banner svg { width: 18px; height: 18px; stroke: var(--success); flex-shrink: 0; }
      `}</style>

      <div className="ep-root">
        <div className="ep-card">

          {/* Top bar */}
          <div className="ep-topbar">
            <button className="ep-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
            <span className="ep-topbar-title">Edit profile</span>
            <button
              className={`ep-btn-save${saved ? " saved" : ""}`}
              onClick={handleSave}
            >
              {saved ? "✓ Saved" : "Done"}
            </button>
          </div>

          {/* Avatar */}
          <div className="ep-avatar-section">
            <div className="ep-avatar-ring" onClick={() => fileRef.current.click()}>
              <div className="ep-avatar-inner">
                {profileImage && <img src={profileImage} alt="Profile" />}
                {!profileImage && initials}
                <div className="ep-avatar-overlay">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
            </div>
            <button className="ep-edit-photo" onClick={() => fileRef.current.click()}>
              Edit photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          {/* Fields */}
          <div>

            {/* Name */}
            <p className="ep-section-label">Name</p>
            <div className="ep-field-group">
              <div className="ep-row">
                <span className="ep-label">First name</span>
                <div className="ep-input-wrap">
                  <input
                    style={inputStyle("firstName")}
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    placeholder="First name"
                  />
                </div>
              </div>
              {errors.firstName && <p className="ep-error-text">{errors.firstName}</p>}
              <div className="ep-row">
                <span className="ep-label">Last name</span>
                <div className="ep-input-wrap">
                  <input
                    style={inputStyle("lastName")}
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <p className="ep-section-label">Account</p>
            <div className="ep-field-group">
              <div className="ep-row">
                <span className="ep-label">Username</span>
                <div className="ep-input-wrap">
                  <input
                    style={inputStyle("userName")}
                    value={form.userName}
                    onChange={handleChange("userName")}
                    placeholder="username"
                    autoComplete="username"
                  />
                </div>
              </div>
              {errors.userName && <p className="ep-error-text">{errors.userName}</p>}
            </div>

            {/* Bio */}
            <p className="ep-section-label">About</p>
            <div className="ep-field-group">
              <div className="ep-row" style={{ alignItems: "flex-start" }}>
                <span className="ep-label" style={{ paddingTop: 2 }}>Bio</span>
                <div className="ep-input-wrap">
                  <textarea
                    className="ep-textarea"
                    value={form.bio}
                    onChange={handleChange("bio")}
                    placeholder="Write a short bio..."
                    rows={3}
                    maxLength={150}
                  />
                </div>
              </div>
              <p className="ep-char-count">{form.bio.length}/150</p>
            </div>

          </div>

          {saved && (
            <div className="ep-save-banner">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Profile updated successfully</span>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EditProfile;