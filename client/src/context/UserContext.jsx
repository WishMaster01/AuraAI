// UserContext.jsx
import axios from "axios";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useClerk } from "@clerk/react";
import { requestAssistantReply } from "../services/assistantApi.js";
import { getApiBaseUrl } from "../config/apiBaseUrl.js";

// eslint-disable-next-line react-refresh/only-export-components
export const userDataContext = createContext();

function UserContext({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
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

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [api, getToken, isSignedIn]);

  const handleCurrentUser = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setUserData(null);
      return null;
    }

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
  }, [api, isLoaded, isSignedIn]);

  const getGeminiResponse = async (command) => {
    if (!isLoaded || !isSignedIn || !userData) {
      console.warn("User data not loaded yet for Gemini request.");
      return {
        type: "general",
        userInput: command,
        response: "Sign in first to use the assistant.",
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
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUserData(null);
      setIsAuthLoading(false);
      return;
    }

    handleCurrentUser();
  }, [handleCurrentUser, isLoaded, isSignedIn]);

  const value = {
    api,
    serverUrl,
    isClerkLoaded: isLoaded,
    isSignedIn,
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
    signOut,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
