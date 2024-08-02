import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, useDisclosure } from "@chakra-ui/react";
import AddUserModal from "./AddUserModal"; // Import the AddUserModal

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "descending",
  }); // New state for sorting
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const usersPerPage = 8; // Users per page

  // Modal hooks
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users"); // Adjust the endpoint as needed
        setUsers(response.data); // Assuming response.data is an array of user objects
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users`, {
          data: { userId },
        });
        setUsers(users.filter((user) => user.user_id !== userId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.user_name.toLowerCase().includes(query) ||
      user.country.toLowerCase().includes(query) ||
      user.state.toLowerCase().includes(query) ||
      user.user_gender.toLowerCase().includes(query)
    );
  });

  // Sorting function
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return null; // No arrow for unsorted columns
  };

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1); // Start from the current page minus 1
    const endPage = Math.min(totalPages, currentPage + 1); // End at the current page plus 1

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) return <div style={{ marginTop: "40px" }}>Loading...</div>;
  if (error) return <div style={{ marginTop: "40px" }}>Error: {error}</div>;

  return (
    <div
      className="user-list"
      style={{
        marginTop: "0px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div>
        <h1
          style={{
            padding: "15px",
            color: "white",
            background: "#29395f",
            fontWeight: "bold",
            fontSize: "1.6rem",
          }}
        >
          User List
        </h1>
      </div>

      <div className="search-bar" style={{ marginTop: "2rem" }}>
        <div
          className="search-bar"
          style={{ color: "black", width: "25rem", borderColor: "black" }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onOpen} colorScheme="teal" style={{ height: "40px" }}>
          Add More Users
        </Button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#e9ecef" }}>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("user_id")}
            >
              User ID{getSortArrow("user_id")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("user_name")}
            >
              Name{getSortArrow("user_name")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("user_email")}
            >
              Email{getSortArrow("user_email")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("contact_number")}
            >
              Contact Number{getSortArrow("contact_number")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("user_gender")}
            >
              Gender{getSortArrow("user_gender")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("country")}
            >
              Country{getSortArrow("country")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("state")}
            >
              State{getSortArrow("state")}
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => handleSort("created_at")}
            >
              Created At{getSortArrow("created_at")}
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.user_id}
              style={{
                backgroundColor: user.user_id % 2 === 0 ? "#f2f2f2" : "white",
              }}
            >
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.user_id}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.user_name}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.user_email}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.contact_number}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.user_gender}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.country}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {user.state}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
                <button onClick={() => handleEdit(user.user_id)}>Edit</button>
                <button onClick={() => handleDelete(user.user_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        {generatePageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              padding: "8px 12px",
              margin: "0 5px",
              backgroundColor:
                currentPage === pageNumber ? "#29395f" : "#e9ecef",
              color: currentPage === pageNumber ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Add User Modal */}
      <AddUserModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default UserList;
