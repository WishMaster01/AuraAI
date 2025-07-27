// UserContext.jsx
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl =
    import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

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
      // Log the full error object for better debugging, especially if it's a 500
      console.error("User fetch error:", error);
      // You might want to clear user data or redirect to login on certain errors (e.g., 401)
      if (error.response && error.response.status === 401) {
        console.log(
          "User not authenticated, redirecting to login (or clearing data)."
        );
        setUserData(null); // Clear user data if not authenticated
        // Add navigation/redirect logic here if using react-router-dom
        // Example: navigate('/login');
      }
    }
  };

  const getGeminiResponse = async (command) => {
    if (!userData) {
      console.warn("User data not loaded yet for Gemini request.");
      return {
        type: "general",
        userInput: command,
        response:
          "User data not loaded yet. Please try again after logging in.",
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
        error.response?.data || error.message,
        error // Log the full error object
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
  }, []); // Run once on mount to fetch user data

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
    handleCurrentUser, // Expose this if you need to manually refetch user data
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
