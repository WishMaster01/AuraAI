import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { userDataContext } from "./context/UserContext.jsx";
import AppLoader from "./components/AppLoader.jsx";

const Signup = lazy(() => import("./pages/Signup.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Customize = lazy(() => import("./pages/Customize.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Customization = lazy(() => import("./pages/Customization.jsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Features = lazy(() => import("./pages/Features.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const Tools = lazy(() => import("./pages/Tools.jsx"));
const PromptLibrary = lazy(() => import("./pages/PromptLibrary.jsx"));
const AppShell = lazy(() => import("./components/AppShell.jsx"));

const App = () => {
  const { userData, isAuthLoading, isSignedIn } = useContext(userDataContext);

  if (isAuthLoading) {
    return <AppLoader message="Verifying your session" />;
  }

  return (
    <Suspense fallback={<AppLoader message="Loading application" />}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="legal" element={<Legal />} />
          <Route path="tools" element={<Tools />} />
          <Route path="prompts" element={<PromptLibrary />} />
        </Route>

        <Route
          path="/signup"
          element={!isSignedIn ? <Signup /> : <Navigate to="/assistant" />}
        />
        <Route
          path="/login"
          element={!isSignedIn ? <Login /> : <Navigate to="/assistant" />}
        />
        <Route
          path="/customize"
          element={isSignedIn ? <Customize /> : <Navigate to="/login" />}
        />
        <Route
          path="/customization"
          element={isSignedIn ? <Customization /> : <Navigate to="/login" />}
        />
        <Route
          path="/assistant"
          element={
            isSignedIn ? (
              userData?.assistantImage && userData?.assistantName ? (
                <Home />
              ) : (
                <Navigate to="/customize" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;
