// UserContext.jsx
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://auraai-2m5o.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log("User fetch error:", error.message);
    }
  };

  const getGeminiResponse = async (command) => {
    if (!userData) {
      console.warn("User data not loaded yet.");
      return {
        type: "general",
        userInput: command,
        response: "User data not loaded yet.",
      };
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        {
          command,
          assistantName: userData.assistantName || "Assistant",
          userName: userData.name || "User",
        },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error(
        "Gemini Request Error:",
        error.response?.data || error.message
      );
      return {
        type: "general",
        userInput: command,
        response:
          error.response?.data?.response || "Sorry, I couldn't process that.",
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
