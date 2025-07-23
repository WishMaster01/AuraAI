import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";

const Card = ({ image }) => {
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
  return (
    <div
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
      className={`w-36 sm:w-40 md:w-44 lg:w-48 aspect-[2/3] bg-[#030326] rounded-2xl overflow-hidden border border-blue-500/30 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-500/40 hover:border-white hover:scale-105 cursor-pointer ${
        selectedImage === image
          ? "border-4 border-white shadow-2xl shadow-blue-500/40"
          : null
      }`}
    >
      <img src={image} alt="card" className="w-full h-full object-cover" />
    </div>
  );
};

export default Card;
