import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Customize from "./pages/Customize.jsx";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import Home from "./pages/Home.jsx";
import Customization from "./pages/Customization.jsx";

const App = () => {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData ? (
            userData.assistantImage && userData.assistantName ? (
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
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signup" />}
      />
      <Route
        path="/customization"
        element={userData ? <Customization /> : <Navigate to="/signup" />}
      />

      {/* Catch-all for unknown routes */}
      {/* <Route path="*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
};

export default App;
