import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import HomePage from "./Pages/HomePage";
import ForgotPassword from "./components/ParentComponent";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import UserList from "./components/UserLists";
import ContactRequest from "./components/ContactRequest";
import EmailTemplates from "./components/EmailTemplate";
import SetNewPassword from "./components/SetNewPassword";

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
          >
            <Route path="" element={<Navigate to="users" />} />{" "}
            {/* Default route */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="contact-request" element={<ContactRequest />} />
            <Route path="change-password" element={<SetNewPassword />} />
            <Route path="manage-templates" element={<EmailTemplates />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
