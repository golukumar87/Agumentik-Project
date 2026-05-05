import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity, ClipboardCheck, Lock, Mail, Radio, ShieldCheck, UserRound } from "lucide-react";
import { clearAuthError, loginUser, registerUser } from "../store/authSlice.js";

export default function AuthPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [localError, setLocalError] = useState(null);
  const [activeInfo, setActiveInfo] = useState("jwt");

  const infoPanels = {
    jwt: {
      title: "JWT protected",
      text: "Login ke baad token save hota hai aur task/insight APIs token ke bina access nahi hoti."
    },
    live: {
      title: "Live updates",
      text: "Socket.io se task create, status change, update aur delete dusre tabs/users me live update hota hai."
    },
    insights: {
      title: "Insights dashboard",
      text: "Dashboard total, completed, pending, daily activity, completed per user aur category distribution calculate karta hai."
    }
  };

  const handleChange = (event) => {
    setLocalError(null);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim()
    };

    if (mode === "register" && form.password.trim() !== form.confirmPassword.trim()) {
      setLocalError("Password and confirm password must match");
      return;
    }

    const action = mode === "login" ? loginUser : registerUser;
    dispatch(action(payload));
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setLocalError(null);
    dispatch(clearAuthError());
  };

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="brand-mark">
          <ClipboardCheck size={34} />
        </div>
        <h1>Productivity Manager</h1>
        <p>Plan work, track deadlines, and let smart priority sorting keep the next important task visible.</p>
        <div className="auth-proof-grid">
          <button className={activeInfo === "jwt" ? "active" : ""} onClick={() => setActiveInfo("jwt")} type="button">
            <ShieldCheck size={18} />
            <span>JWT protected</span>
          </button>
          <button className={activeInfo === "live" ? "active" : ""} onClick={() => setActiveInfo("live")} type="button">
            <Radio size={18} />
            <span>Live updates</span>
          </button>
          <button
            className={activeInfo === "insights" ? "active" : ""}
            onClick={() => setActiveInfo("insights")}
            type="button"
          >
            <Activity size={18} />
            <span>Insights dashboard</span>
          </button>
        </div>
        <div className="auth-info-panel">
          <strong>{infoPanels[activeInfo].title}</strong>
          <p>{infoPanels[activeInfo].text}</p>
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication form">
        <div className="auth-panel-head">
          <p className="eyebrow">Secure workspace</p>
          <h2>{mode === "login" ? "Login to continue" : "Create your account"}</h2>
        </div>
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")} type="button">
            Login
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")} type="button">
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          {mode === "register" && (
            <label className="input-row">
              <UserRound size={18} />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" minLength="2" required />
            </label>
          )}
          <label className="input-row">
            <Mail size={18} />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" type="email" required />
          </label>
          <label className="input-row">
            <Lock size={18} />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              minLength="6"
              required
            />
          </label>
          {mode === "register" && (
            <label className="input-row">
              <Lock size={18} />
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                type="password"
                minLength="6"
                required
              />
            </label>
          )}
          {(localError || error) && <p className="error-text">{localError || error}</p>}
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
