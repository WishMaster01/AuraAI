import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Menu, X } from "lucide-react";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { userDataContext } from "../../context/UserContext.jsx";

const Home = () => {
  const { userData, setUserData, serverUrl, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isAssistantRunning, setIsAssistantRunning] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const recognitionRef = useRef(null);
  const voicesReadyRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const restartingRef = useRef(false);

  const handleStartAssistant = () => {
    hasInteractedRef.current = true;
    setHasClicked(true);
    setIsAssistantRunning(true);
  };

  const handleStopAssistant = () => {
    setIsAssistantRunning(false);
    try {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    } catch (err) {
      console.error("Stop Assistant Error:", err);
    }
  };

  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesReadyRef.current = true;
        window.speechSynthesis.onvoiceschanged = null;
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      voicesReadyRef.current = true;
    } else {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
  }, []);

  const speak = (text, callback) => {
    if (!hasInteractedRef.current || !isAssistantRunning) return;

    try {
      window.speechSynthesis.cancel();

      if (!voicesReadyRef.current) {
        console.warn("Voices not ready.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang === "hi-IN") ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onerror = (e) => console.error("Speech error:", e.error);
      utterance.onend = () => {
        setAiText("");
        if (typeof callback === "function") callback();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speak error:", err);
    }
  };

  const handleCommand = (data, transcript) => {
    const { type, response, userInput } = data;
    const query = encodeURIComponent(userInput || transcript);
    const normalizedType = (type || "").toLowerCase().replace(/\s+/g, "_");

    speak(response, () => {
      switch (normalizedType) {
        case "google_search":
        case "search_google":
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
          break;
        case "calculator_open":
          window.open(`https://www.google.com/search?q=calculator`, "_blank");
          break;
        case "instagram_open":
          window.open(`https://www.instagram.com`, "_blank");
          break;
        case "facebook_open":
          window.open(`https://www.facebook.com`, "_blank");
          break;
        case "weather_show":
          const city = userInput?.toLowerCase().includes("weather of")
            ? userInput.split("weather of")[1]?.trim()
            : userInput;
          window.open(
            `https://www.google.com/search?q=weather+in+${encodeURIComponent(
              city || "your city"
            )}`,
            "_blank"
          );
          break;
        case "youtube_open":
          window.open("https://www.youtube.com", "_blank");
          break;
        case "youtube":
        case "youtube_search":
        case "youtube_play":
          window.open(
            `https://www.youtube.com/results?search_query=${query}`,
            "_blank"
          );
          break;
        case "get_time":
        case "get_day":
        case "general":
        case "get_month":
          break;
        default:
          console.warn("Unrecognized command type:", type);
      }

      if (
        recognitionRef.current &&
        isAssistantRunning &&
        !restartingRef.current
      ) {
        restartingRef.current = true;
        setTimeout(() => {
          restartingRef.current = false;
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Restart error:", err);
          }
        }, 500);
      }
    });
  };

  useEffect(() => {
    if (!hasClicked || !isAssistantRunning) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {
        setUserText(transcript);
        setAiText("");
        recognition.stop();
        const data = await getGeminiResponse(transcript);
        console.log(data);
        if (data) {
          handleCommand(data, transcript);
          setAiText(data.response);
        } else {
          speak("I'm sorry, I couldn't understand that.", () =>
            recognition.start()
          );
        }
        setUserText("");
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
      recognition.abort();
      try {
        recognition.start();
      } catch (err) {
        console.error("Restart after error failed:", err);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Initial recognition start failed:", err);
    }

    return () => {
      recognition.stop();
    };
  }, [hasClicked, isAssistantRunning]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
      setUserData(null);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-black to-[#02023D] flex flex-col items-center justify-center px-4 py-10 relative text-white overflow-hidden">
      {!hasClicked && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            onClick={handleStartAssistant}
            className="text-xl px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white hover:scale-105 transition-all cursor-pointer"
          >
            Start Assistant
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      <div className="absolute top-6 right-6 sm:hidden z-40">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600 shadow-lg py-4 px-4 text-white space-y-4">
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:text-red-400 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/customize")}
                className="block w-full text-left hover:text-blue-400 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Customize Assistant
              </button>
              {isAssistantRunning ? (
                <button
                  onClick={handleStopAssistant}
                  className="block w-full text-left hover:text-gray-300 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Stop Assistant
                </button>
              ) : (
                <button
                  onClick={handleStartAssistant}
                  className="block w-full text-left hover:text-green-400 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Start Assistant
                </button>
              )}
            </div>

            {/* History Section */}
            <div className="border-t border-gray-600 pt-3">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                HISTORY
              </h1>
              <div className="max-h-60 overflow-y-auto flex flex-col space-y-2 pr-2">
                {userData.history?.map((his) => (
                  <span className="text-gray-200 text-sm truncate py-1 px-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors">
                    {his}
                  </span>
                ))}
                {!userData.history?.length && (
                  <p className="text-gray-400 text-sm italic">No history yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex absolute top-6 right-6 space-x-4">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2 rounded-full hover:scale-105 cursor-pointer"
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/customize")}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-full hover:scale-105 cursor-pointer"
        >
          Customize Assistant
        </button>
        {isAssistantRunning ? (
          <button
            onClick={handleStopAssistant}
            className="bg-gradient-to-r from-gray-500 to-gray-700 px-5 py-2 rounded-full hover:scale-105 cursor-pointer"
          >
            Stop Assistant
          </button>
        ) : (
          <button
            onClick={handleStartAssistant}
            className="bg-gradient-to-r from-green-500 to-lime-600 px-5 py-2 rounded-full hover:scale-105 cursor-pointer"
          >
            Start Assistant
          </button>
        )}
      </div>

      {/* Assistant Avatar */}
      <div className="w-[300px] h-[400px] sm:w-[350px] sm:h-[450px] rounded-3xl shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-white/10 overflow-hidden">
        <img
          src={userData?.assistantImage}
          alt="Assistant Avatar"
          className="w-full h-full object-cover scale-110 transition-transform duration-500 hover:scale-100"
        />
      </div>

      <h1 className="mt-6 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

      <h1 className="mt-8 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 text-transparent bg-clip-text break-words px-4">
        {userText ? userText : aiText ? aiText : ""}
      </h1>
    </div>
  );
};

export default Home;
