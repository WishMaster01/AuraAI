import React from "react";
import { Link } from "react-router-dom";
import { SignIn } from "@clerk/react";
import AuthLayout from "../components/AuthLayout.jsx";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with Google or email and password using Clerk."
      footer={
        <>
          Do not have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-cyan-200 hover:text-cyan-100"
          >
            Create one
          </Link>
        </>
      }
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/40">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          appearance={{
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "iconButton",
            },
            elements: {
              cardBox: "w-full shadow-none bg-transparent",
              card: "bg-transparent shadow-none",
              rootBox: "w-full",
              headerTitle: "text-slate-100",
              headerSubtitle: "text-slate-400",
              formButtonPrimary:
                "bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 text-slate-950 hover:brightness-110",
              formFieldInput:
                "aura-input px-4 py-3.5 text-sm border-white/10 bg-white/[0.04]",
              formFieldLabel: "text-slate-400",
              socialButtonsBlockButton:
                "border border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]",
              footerActionLink: "text-cyan-200 hover:text-cyan-100",
            },
          }}
        />
      </div>
    </AuthLayout>
  );
};

export default Login;
