import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import bg from "../assets/authBg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { userDataContext } from "../../context/UserContext.jsx";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      console.log(result);
      navigate("/customize");
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
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl shadow-blue-900/50 flex flex-col items-center gap-6 border border-white/20"
      >
        <h1 className="text-white text-4xl font-extrabold text-center drop-shadow-lg">
          Join <span className="text-blue-400">AuraAI</span>
        </h1>
        <p className="text-white text-lg text-center opacity-90">
          Unlock the future of intelligent insights.
        </p>

        {/* Name Input */}
        <div className="w-full">
          <input
            type="text"
            name="name"
            placeholder="ENTER YOUR NAME"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70 text-lg transition duration-300 ease-in-out"
          />
        </div>

        {/* Email Input */}
        <div className="w-full">
          <input
            type="email"
            name="email"
            placeholder="ENTER YOUR EMAIL"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70 text-lg transition duration-300 ease-in-out"
          />
        </div>

        {/* Password Input */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="CREATE PASSWORD"
            onChange={(e) => setPassowrd(e.target.value)}
            value={password}
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

        {/* Confirm Password Input */}
        <div className="w-full relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            onChange={(e) => setConfirmPassowrd(e.target.value)}
            value={confirmPassword}
            required
            className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/70 text-lg pr-10 transition duration-300 ease-in-out"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </span>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="w-full flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="form-checkbox h-5 w-5 text-blue-400 bg-white/20 border-white/30 rounded focus:ring-blue-400"
          />
          <label htmlFor="terms" className="text-white text-sm opacity-90">
            I agree to the{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Error Viewing Section */}
        {error.length > 0 && (
          <p className="text-red-600 text-[20px]">*{error}</p>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg text-xl hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "LOADING...." : "SIGN IN"}
        </button>

        <div className="text-white text-center text-sm opacity-90">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
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

        {/* Google Sign Up Button */}
        <button
          type="button"
          className="w-full p-3 flex items-center justify-center gap-3 bg-white/20 text-white font-semibold rounded-lg text-lg border border-white/30 hover:bg-white/30 transition duration-300 ease-in-out shadow-md"
        >
          <FcGoogle size={24} /> Sign up with Google
        </button>
      </form>
    </div>
  );
};

export default Signup;
