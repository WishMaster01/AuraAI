// UserContext.jsx
import axios from "axios";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { requestAssistantReply } from "../services/assistantApi.js";
import { getApiBaseUrl } from "../config/apiBaseUrl.js";

// eslint-disable-next-line react-refresh/only-export-components
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = getApiBaseUrl();
  const api = useMemo(
    () =>
      axios.create({
        baseURL: serverUrl,
        withCredentials: true,
      }),
    [serverUrl]
  );

  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      const result = await api.get("/api/user/current");
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      if (error?.response?.status !== 401) {
        console.error("User fetch error:", error);
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, [api]);

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
      return await requestAssistantReply({
        api,
        command,
        assistantName: userData.assistantName || "Assistant",
        userName: userData.name || "User",
      });
    } catch (error) {
      console.error(
        "Assistant Request Error:",
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
  }, [handleCurrentUser]);

  const value = {
    api,
    serverUrl,
    userData,
    setUserData,
    isAuthLoading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
    handleCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
