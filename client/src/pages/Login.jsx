import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import bg from "../assets/authBg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { userDataContext } from "../../context/UserContext.jsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`, formData, {
        withCredentials: true,
      });
      console.log("Login success:", result.data);
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google Login...");
  };

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl shadow-blue-900/50 flex flex-col items-center gap-6 border border-white/20"
      >
        <h1 className="text-white text-4xl font-extrabold text-center drop-shadow-lg">
          Welcome Back to <span className="text-blue-400">AuraAI</span>
        </h1>
        <p className="text-white text-lg text-center opacity-90">
          Sign in to continue your journey.
        </p>

        {/* Email Input */}
        <div className="w-full">
          <input
            type="email"
            name="email"
            placeholder="YOUR EMAIL"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70 text-lg transition duration-300 ease-in-out"
          />
        </div>

        {/* Password Input */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="YOUR PASSWORD"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70 text-lg pr-10 transition duration-300 ease-in-out"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>

        {/* Forgot Password */}
        <div className="w-full text-right -mt-2">
          <a
            href="#"
            className="text-blue-400 hover:underline text-sm font-medium"
          >
            Forgot Password?
          </a>
        </div>

        {/* Error Message */}
        {error.length > 0 && (
          <p className="text-red-600 text-[20px]">*{error}</p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg text-xl hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "LOADING...." : "LOG IN"}
        </button>

        <div className="text-white text-center text-sm opacity-90">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            Sign Up
          </span>
        </div>

        {/* Separator */}
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-white/90">
            <span className="bg-[#00000062] px-3 text-sm rounded-full">OR</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full p-3 flex items-center justify-center gap-3 bg-white/20 text-white font-semibold rounded-lg text-lg border border-white/30 hover:bg-white/30 transition duration-300 ease-in-out shadow-md"
        >
          <FcGoogle size={24} /> Log in with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
