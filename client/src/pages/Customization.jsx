import React, { useContext, useState } from "react";
import bg from "../assets/customizationBg.jpg";
import { IoMdArrowBack } from "react-icons/io";
import { userDataContext } from "../../context/UserContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router";

const Customization = () => {
  const { serverUrl, userData, setUserData, backendImage, selectedImage } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border border-white/20 flex flex-col items-center gap-8">
        <IoMdArrowBack
          onClick={() => navigate("/customize")}
          className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        />
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Enter Your{" "}
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-text-shimmer bg-[length:200%_100%]">
            ASSISTANT NAME
          </span>
          <span className="block mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
        </h1>

        {/* Input Field */}
        <input
          type="text"
          name="name"
          placeholder="ENTER YOUR ASSISTANT NAME"
          required
          className="w-full p-4 bg-white/10 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/70 text-lg transition duration-300 ease-in-out"
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {/* CTA Button */}
        {assistantName && (
          <button
            onClick={() => handleUpdateAssistant()}
            className="min-w-[150px] h-[60px] mt-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "LOADING...." : "CREATE ASSISTANT"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Customization;
