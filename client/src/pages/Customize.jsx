import React, { useContext, useRef } from "react";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const avatars = [image1, image2, image3, image4, image5, image6, image7];

const Customize = () => {
  const {
    frontendImage,
    setFrontendImage,
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
    <div className="aura-page flex min-h-screen flex-col px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-20 rounded-lg border border-white/15 bg-slate-950/70 p-2 text-slate-200 backdrop-blur transition hover:border-cyan-300/45 hover:bg-white/[0.08]"
        aria-label="Go back"
      >
        <IoMdArrowBack className="h-5 w-5" />
      </button>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 pt-12">
        <div className="max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase text-cyan-200">Assistant setup</p>
          <h1 className="aura-heading mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Select your <span className="aura-gradient-text">assistant image</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Choose a built-in assistant avatar or upload a custom image. The layout stays compact for extension views and expands cleanly on desktop.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {avatars.map((image) => (
            <Card key={image} image={image} />
          ))}

          <button
            type="button"
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("input");
            }}
            className={`aura-border flex aspect-[2/3] w-full max-w-[9.5rem] items-center justify-center overflow-hidden rounded-lg border bg-slate-950/70 text-cyan-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-[0_18px_54px_rgba(34,211,238,0.18)] sm:max-w-[10rem] md:max-w-[11rem] lg:max-w-[12rem] ${
              selectedImage === "input"
                ? "border-cyan-200 shadow-[0_0_0_2px_rgba(34,211,238,0.36),0_20px_64px_rgba(34,211,238,0.2)]"
                : "border-white/10"
            }`}
          >
            {!frontendImage && <RiImageAddLine size={34} />}
            {frontendImage && (
              <img src={frontendImage} alt="Uploaded assistant preview" className="h-full w-full object-cover" />
            )}
          </button>
          <input type="file" accept="image/*" ref={inputImage} onChange={handleImage} hidden />
        </div>

        {selectedImage && (
          <button
            onClick={() => navigate("/customization")}
            className="rounded-lg bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 px-6 py-3 text-sm font-black text-slate-950 shadow-[0_16px_42px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Next
          </button>
        )}
      </main>
    </div>
  );
};

export default Customize;
