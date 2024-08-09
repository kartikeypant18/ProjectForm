import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import UserList from "../components/UserLists";
import Dashboard from "../components/Dashboard";
import ContactRequest from "../components/ContactRequest"; // Import the ContactRequest component
import EmailTemplates from "../components/EmailTemplate";
import "../App.css";

const HomePage = () => {
  const [currentComponent, setCurrentComponent] = useState("Users");

  const renderComponent = () => {
    switch (currentComponent) {
      case "Users":
        return <UserList />;
      case "Dashboard":
        return <Dashboard />;
      case "ContactRequest":
        return <ContactRequest />;
      case "ManageTemplates": // Add case for ManageTemplates
        return <EmailTemplates />;
      default:
        return <UserList />;
    }
  };

  const handleNavigation = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div className="app">
      <Header
        handleNavigation={handleNavigation}
        activeItem={currentComponent}
      />
      <div className="content">
        <Sidebar
          handleNavigation={handleNavigation}
          currentComponent={currentComponent}
        />
        {renderComponent()}
      </div>
    </div>
  );
};

export default HomePage;
