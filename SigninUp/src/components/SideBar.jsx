import React from "react";

const Sidebar = ({ handleNavigation, currentComponent }) => {
  return (
    <div
      className="sidebar"
      style={{ marginTop: "1.2rem", marginLeft: "16px" }}
    >
      <ul style={{ color: "white", listStyleType: "none", padding: 0 }}>
        {[
          "Dashboard",
          "Users",
          "Employees",
          "ChangePassword",
          "ContactRequest",
          "ManageTemplates",
          "Settings",
        ].map((component) => (
          <li
            key={component}
            onClick={() => handleNavigation(component)}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor:
                currentComponent === component ? "#29395f" : "transparent",
              color: currentComponent === component ? "white" : "black", // Keep text color white
              fontWeight: currentComponent === component ? "bold" : "normal", // Bold for active
              transform:
                currentComponent === component ? "scale(1.1)" : "scale(1)", // Bulging effect for active
            }}
          >
            {component}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
