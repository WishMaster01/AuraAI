import { HandleSSOCallback } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import AppLoader from "../components/AppLoader.jsx";

const SSOCallback = () => {
  const navigate = useNavigate();

  return (
    <>
      <HandleSSOCallback
        navigateToApp={() => {
          navigate("/", { replace: true });
        }}
        navigateToSignIn={() => {
          navigate("/login", { replace: true });
        }}
        navigateToSignUp={() => {
          navigate("/signup", { replace: true });
        }}
      />
      <AppLoader message="Completing sign in" />
    </>
  );
};

export default SSOCallback;
