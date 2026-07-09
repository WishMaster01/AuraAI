import React, { useContext, useState } from "react";
import bg from "../assets/customizationBg.jpg";
import { IoMdArrowBack } from "react-icons/io";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Customization = () => {
  const { serverUrl, userData, setUserData, backendImage, selectedImage } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      showSuccess("Assistant created successfully!");
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error("Update assistant error:", error);
      showError("Failed to update assistant. Please try again.");
    }
  };

  return (
    <div className="aura-page flex min-h-screen items-center justify-center px-4 py-8 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${bg})` }} />
      <div className="aura-glass aura-border relative w-full max-w-2xl rounded-lg p-5 sm:p-8">
        <button
          type="button"
          onClick={() => navigate("/customize")}
          className="absolute left-4 top-4 rounded-lg border border-white/15 bg-white/[0.04] p-2 text-slate-200 transition hover:border-cyan-300/45 hover:bg-white/[0.08]"
          aria-label="Go back"
        >
          <IoMdArrowBack className="h-5 w-5" />
        </button>

        <div className="mx-auto max-w-lg pt-10 text-center sm:pt-6">
          <p className="text-xs font-semibold uppercase text-cyan-200">Assistant identity</p>
          <h1 className="aura-heading mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Name your <span className="aura-gradient-text">assistant</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Pick a short, memorable name that fits your Chrome assistant workflow.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <label htmlFor="assistant-name" className="block text-sm font-semibold text-slate-300">
            Assistant name
          </label>
          <input
            id="assistant-name"
            type="text"
            name="name"
            placeholder="Aura, Nova, Orbit..."
            required
            className="aura-input px-4 py-3 text-base"
            onChange={(e) => setAssistantName(e.target.value)}
            value={assistantName}
          />

          {assistantName && (
            <button
              onClick={() => handleUpdateAssistant()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 px-6 py-3 text-sm font-black text-slate-950 shadow-[0_16px_42px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:brightness-110"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  Creating assistant...
                </>
              ) : (
                "Create Assistant"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customization;
