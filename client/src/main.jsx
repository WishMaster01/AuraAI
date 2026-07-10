import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import UserContext from "./context/UserContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ""}
    >
      <BrowserRouter>
        <ToastProvider>
          <UserContext>
            <App />
          </UserContext>
        </ToastProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
