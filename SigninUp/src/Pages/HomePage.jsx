import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import UserList from "../components/UserLists";
import Dashboard from "../components/Dashboard"; // Import the Dashboard component
import "../App.css";

const HomePage = () => {
  const [currentComponent, setCurrentComponent] = useState("Users"); // Default component to show

  const renderComponent = () => {
    switch (currentComponent) {
      case "Users":
        return <UserList />;
      case "Dashboard":
        return <Dashboard />;
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
