import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import UserList from "../components/UserLists";

import "../App.css";

const HomePage = () => {
  const [currentComponent, setCurrentComponent] = useState("UserList"); // Default component to show

  const renderComponent = () => {
    switch (currentComponent) {
      case "Users":
        return <UserList />;

      default:
        return <UserList />;
    }
  };

  const handleNavigation = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div className="app">
      <Header handleNavigation={handleNavigation} />
      <div className="content">
        <Sidebar handleNavigation={handleNavigation} />
        {renderComponent()}
      </div>
    </div>
  );
};

export default HomePage;
