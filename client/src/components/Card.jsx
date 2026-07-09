import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";

const Card = ({ image }) => {
  const {
    setFrontendImage,
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
      className={`group aura-border relative aspect-[2/3] w-full max-w-[9.5rem] cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-[0_18px_54px_rgba(34,211,238,0.18)] sm:max-w-[10rem] md:max-w-[11rem] lg:max-w-[12rem] ${
        selectedImage === image
          ? "border-cyan-200 shadow-[0_0_0_2px_rgba(34,211,238,0.36),0_20px_64px_rgba(34,211,238,0.2)]"
          : ""
      }`}
    >
      <img
        src={image}
        alt="Assistant avatar option"
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/75 to-transparent" />
    </div>
  );
};

export default Card;
