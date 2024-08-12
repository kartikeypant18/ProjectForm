import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentComponent, setCurrentComponent] = useState("Dashboard");

  useEffect(() => {
    // Map the current path to the corresponding component
    const pathMap = {
      "/homepage/dashboard": "Dashboard",
      "/homepage/users": "Users",
      "/homepage/change-password": "ChangePassword",
      "/homepage/contact-request": "ContactRequest",
      "/homepage/manage-templates": "ManageTemplates",
      "/homepage/settings": "Settings",
    };

    setCurrentComponent(pathMap[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const handleNavigation = (component) => {
    const pathMap = {
      Dashboard: "dashboard",
      Users: "users",
      ChangePassword: "change-password",
      ContactRequest: "contact-request",
      ManageTemplates: "manage-templates",
      Settings: "settings",
    };

    const path = pathMap[component];
    if (path) {
      navigate(`/homepage/${path}`);
    }
  };

  return (
    <div className="app">
      <Header
        handleNavigation={handleNavigation}
        currentComponent={currentComponent}
      />
      <div className="content">
        <Sidebar
          handleNavigation={handleNavigation}
          currentComponent={currentComponent}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
