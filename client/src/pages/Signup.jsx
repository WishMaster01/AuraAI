import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useToast } from "../context/ToastContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";

const inputClass = "aura-input px-4 py-3.5 text-sm";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(userDataContext);
  const { showSuccess, showError } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      showError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      showError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true });
      setUserData(result.data);
      showSuccess("Account created! Customize your assistant.");
      navigate("/customize");
    } catch (err) {
      setUserData(null);
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start free and personalize your AI assistant in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-400">Full name</label>
          <input id="name" type="text" name="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} autoComplete="name" />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-400">Email</label>
          <input id="email" type="email" name="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} autoComplete="email" />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-400">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputClass} pr-11`} autoComplete="new-password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-400">Confirm password</label>
          <div className="relative">
            <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={`${inputClass} pr-11`} autoComplete="new-password" />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-400">
          <input type="checkbox" required className="mt-1 rounded border-white/20 bg-black/30 text-cyan-500 focus:ring-cyan-400" />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>

        {error && <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? <span className="inline-flex items-center gap-2"><LoadingSpinner size="small" color="white" />Creating account...</span> : "Create account"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          <Link to="/" className="text-slate-400 transition hover:text-cyan-200">Back to home</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
