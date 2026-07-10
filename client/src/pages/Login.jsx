import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useToast } from "../context/ToastContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";

const inputClass = "aura-input px-4 py-3.5 text-sm";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { api, setUserData } = useContext(userDataContext);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.post("/api/auth/login", formData);
      setUserData(result.data);
      showSuccess("Welcome back!");
      navigate("/assistant");
    } catch (err) {
      setUserData(null);
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue with your AI browser assistant."
      footer={
        <>
          Do not have an account?{" "}
          <Link to="/signup" className="font-semibold text-cyan-200 hover:text-cyan-100">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-400">Email</label>
          <input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className={inputClass} autoComplete="email" />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-400">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className={`${inputClass} pr-11`} autoComplete="current-password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? <span className="inline-flex items-center gap-2"><LoadingSpinner size="small" color="white" />Signing in...</span> : "Sign in"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          <Link to="/" className="text-slate-400 transition hover:text-cyan-200">Back to home</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
