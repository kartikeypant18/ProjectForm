import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Handle the edit action (e.g., redirect to edit page)
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    // Handle the delete action
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.user_id !== userId)); // Remove the user from the list
    }
  };

  const totalUsers = users.length;
  const totalMales = users.filter((user) => user.user_gender === "male").length;
  const totalFemales = users.filter(
    (user) => user.user_gender === "female"
  ).length;
  const today = new Date().toLocaleDateString();
  const totalCreatedToday = users.filter(
    (user) => new Date(user.created_at).toLocaleDateString() === today
  ).length;

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
      <div
        style={{
          background: "grey",
          height: "6rem",
          padding: "5px",
          marginTop: "-1rem",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "10px",
            height: "6rem",
            boxShadow: " 4px 2px 8px rgba(0, 0, 0, 0.4)",
            width: "10rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Total Users: {totalUsers}
        </div>
        <div
          style={{
            background: "white",
            padding: "10px",
            height: "6rem",
            boxShadow: " 4px 2px 8px rgba(0, 0, 0, 0.4)",
            width: "10rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Total Males: {totalMales}
        </div>
        <div
          style={{
            background: "white",
            padding: "10px",
            height: "6rem",
            boxShadow: " 4px 2px 8px rgba(0, 0, 0, 0.4)",
            width: "10rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Total Females: {totalFemales}
        </div>
        <div
          style={{
            background: "white",
            padding: "10px",
            height: "6rem",
            boxShadow: " 4px 2px 8px rgba(0, 0, 0, 0.4)",
            width: "10rem",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Created Today: {totalCreatedToday}
        </div>
      </div>
      <div className="search-bar" style={{ marginTop: "2rem" }}>
        <div
          className="search-bar"
          style={{ color: "black", width: "25rem", borderColor: "black" }}
        >
          <input type="text" placeholder="Search..." />
        </div>
        <button style={{ height: "" }}>Add More Users</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#e9ecef" }}>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              User ID
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Email
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Contact Number
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Gender
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Country
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              State
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Created At
            </th>
            <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
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
    </div>
  );
};

export default UserList;
