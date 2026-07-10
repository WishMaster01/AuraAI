// UserContext.jsx
import axios from "axios";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { requestAssistantReply } from "../services/assistantApi.js";
import { getApiBaseUrl } from "../config/apiBaseUrl.js";

// eslint-disable-next-line react-refresh/only-export-components
export const userDataContext = createContext();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function UserContext({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
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
      let lastError = null;
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const token = await getToken();
        if (!token) {
          lastError = new Error("Clerk session token is not ready yet.");
          await sleep(250 * (attempt + 1));
          continue;
        }

        try {
          const result = await api.get("/api/user/current", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(result.data);
          return result.data;
        } catch (error) {
          lastError = error;
          if (error?.response?.status !== 401 || attempt === 3) {
            throw error;
          }

          await sleep(300 * (attempt + 1));
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (error) {
      setUserData(null);
      if (error?.response?.status !== 401) {
        console.error("User fetch error:", error);
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, [api, getToken, isLoaded, isSignedIn]);

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
    if (!isLoaded || !isUserLoaded) return;

    if (!isSignedIn) {
      setUserData(null);
      setIsAuthLoading(false);
      return;
    }

    handleCurrentUser();
  }, [handleCurrentUser, isLoaded, isSignedIn, isUserLoaded, user?.id]);

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
