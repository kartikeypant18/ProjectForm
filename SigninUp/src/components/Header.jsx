import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = ({ handleNavigation, activeItem }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();

    toast({
      title: "Logged out successfully.",
      description: "You have been logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", component: "Dashboard" },
    { label: "Users", component: "Users" },
    { label: "Employees", component: "Employees" },
    { label: "Change Password", component: "ChangePassword" },
    { label: "Contact Request", component: "ContactRequest" },
    { label: "Manage Templates", component: "ManageTemplates" },
    { label: "Settings", component: "Settings" },
  ];

  const handleItemClick = (component) => {
    handleNavigation(component);
  };

  return (
    <div className="header" style={{ height: "180px" }}>
      <div className="logo" style={{ marginTop: "-50px", marginLeft: "40px" }}>
        <img
          src="/logo-no-background.png"
          alt="Logo"
          style={{
            height: "90px",
            width: "11rem",
            // backgroundColor: " #29395f",
          }}
        />
      </div>
      <div
        className="nav"
        style={{
          background: "white",
          color: "black",
          marginTop: "90px",
          marginRight: "2.8rem",
        }}
      >
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            padding: "2px",
            margin: "8px",
            width: "100%",
          }}
        >
          {navItems.map((item) => (
            <li key={item.label} style={{ marginRight: "20px" }}>
              <Button
                variant="link"
                onClick={() => handleItemClick(item.component)}
                style={{
                  padding: "0.5rem 1rem",
                  fontWeight: item.component === activeItem ? "bold" : "normal",
                  border:
                    item.component === activeItem ? "2px solid black" : "none",
                  borderRadius: "4px",
                  transition: "transform 0.2s",
                  transform:
                    item.component === activeItem ? "scale(1.1)" : "scale(1)",
                  color: "black", // Ensure the text color is always black
                }}
              >
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="user-info"
        style={{ marginTop: "-50px", marginRight: "40px" }}
      >
        <Button onClick={handleLogout} style={{ padding: "8px" }}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Header;
