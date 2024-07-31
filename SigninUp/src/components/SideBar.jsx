import React from "react";

const Sidebar = ({ handleNavigation }) => {
  return (
    <div
      className="sidebar"
      style={{ marginTop: "1.2rem", marginLeft: "16px" }}
    >
      <ul style={{ color: "white" }}>
        <li onClick={() => handleNavigation("Dashboard")}>Dashboard</li>
        <li onClick={() => handleNavigation("Users")}>Users</li>
        <li onClick={() => handleNavigation("Employees")}>Employees</li>
        <li onClick={() => handleNavigation("ChangePassword")}>
          Change Password
        </li>
        <li onClick={() => handleNavigation("ContactRequest")}>
          Contact Request
        </li>
        <li onClick={() => handleNavigation("ManageTemplates")}>
          Manage Templates
        </li>
        <li onClick={() => handleNavigation("Settings")}>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
