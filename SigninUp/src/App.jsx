import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp"; // Adjust the import path as needed
import Login from "./components/Login";

import ChangePassword from "./components/ChangePassword";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Login />} />

          <Route path="/newPassword" element={<ChangePassword />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
