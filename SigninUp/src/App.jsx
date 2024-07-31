import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp"; // Adjust the import path as needed
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import HomePage from "./Pages/HomePage";
import ForgotPassword from "./components/ParentComponent";
import ProtectedRoute from "./routes/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ChangePassword />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="/homepage"
            element={<ProtectedRoute element={<HomePage />} />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
