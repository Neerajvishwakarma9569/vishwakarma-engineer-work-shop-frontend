import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Pencil, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import OrderHistory from "../components/OrderHistory";
import "./Css/Profile.css";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(user?.profileImageUrl || "");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photo, user?.profileImageUrl]);

  const openEditor = () => {
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
    setPhoto(null);
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setPhoto(null);
      setError("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setPhoto(null);
      setError("Profile photos must be 5 MB or smaller.");
      return;
    }
    setError("");
    setPhoto(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());
      if (photo) payload.append("profileImage", photo);
      const result = await updateProfile(payload);
      setSuccess(result.message || "Profile updated successfully.");
      setEditing(false);
      setPhoto(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-banner">
        <div className="container profile-banner-inner">
          <div className="profile-avatar">
            {user?.profileImageUrl
              ? <img src={user.profileImageUrl} alt={`${user.name || "User"} profile`} />
              : <UserRound size={30} />}
          </div>
          <div className="profile-identity">
            <span className="eyebrow gold">YOUR ACCOUNT</span>
            <h1>{user?.name || "Your profile"}</h1>
            <p>{user?.email}</p>
          </div>
          <div className="profile-actions">
            <button className="btn btn-outline profile-edit-button" type="button" onClick={openEditor}>
              <Pencil size={16} /> Edit profile
            </button>
            <Link className="btn btn-gold profile-orders-link" to="/my-orders">
              My orders <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {success && <p className="container profile-update-success" role="status">{success}</p>}
      <section className="container profile-purchases section">
        <div className="profile-section-heading">
          <div>
            <span className="eyebrow">PURCHASE HISTORY</span>
            <h2>Products you’ve ordered</h2>
            <p>Review product quantities, order status and delivery details.</p>
          </div>
        </div>
        <OrderHistory />
      </section>

      {editing && (
        <div
          className="profile-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditing(false);
          }}
        >
          <section
            className="profile-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-edit-title"
          >
            <header className="profile-edit-modal-header">
              <div>
                <span className="eyebrow">ACCOUNT SETTINGS</span>
                <h2 id="profile-edit-title">Edit your profile</h2>
                <p>Update your name, contact details, and profile photo.</p>
              </div>
              <button
                className="profile-modal-close"
                type="button"
                aria-label="Close profile editor"
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                <X size={18} />
              </button>
            </header>

            {error && <p className="profile-edit-error" role="alert">{error}</p>}

            <form className="profile-edit-form" onSubmit={saveProfile}>
              <div className="profile-photo-editor">
                <div className="profile-photo-preview">
                  {photoPreview
                    ? <img src={photoPreview} alt="Profile photo preview" />
                    : <UserRound size={28} />}
                </div>
                <label className="profile-photo-picker">
                  <Camera size={16} />
                  Choose photo
                  <input type="file" accept="image/*" onChange={choosePhoto} />
                </label>
                <small>Image up to 5 MB</small>
              </div>

              <label>
                Full name
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  maxLength={30}
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>

              <div className="profile-edit-modal-actions">
                <button className="btn btn-outline profile-modal-cancel" type="button" disabled={saving} onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button className="btn btn-dark" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
