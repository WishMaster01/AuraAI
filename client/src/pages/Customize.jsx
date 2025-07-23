import React, { useContext, useRef, useState } from "react";
import Card from "../../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import { userDataContext } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center py-10 px-4">
      <IoMdArrowBack
        onClick={() => navigate("/")}
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 md:mb-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
          Select Your{" "}
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-text-shimmer bg-[length:200%_100%]">
          ASSISTANT IMAGE
        </span>
        <span className="block mt-2 h-1 w-20 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
      </h1>
      <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Add Image Card */}
        <div
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
          className={`w-36 sm:w-40 md:w-44 lg:w-48 aspect-[2/3] bg-[#030326] rounded-2xl border border-blue-500/30 flex items-center justify-center text-white text-4xl transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-500/40 hover:border-white hover:scale-105 cursor-pointer  ${
            selectedImage === "input"
              ? "border-4 border-white shadow-2xl shadow-blue-500/40"
              : null
          }`}
        >
          {!frontendImage && <RiImageAddLine size={36} />}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          onChange={handleImage}
          hidden
        />
      </div>
      {/* Button Component */}
      {selectedImage && (
        <button
          onClick={() => navigate("/customization")}
          className="min-w-[150px] h-[60px] mt-8 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
        >
          NEXT
        </button>
      )}
    </div>
  );
};

export default Customize;
