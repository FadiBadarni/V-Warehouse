import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInfo } from "../../api/api";
import { logoutUser } from "../../api/api";

import "./Dashboard.scss";

function Dashboard() {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [picture, setPicture] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    } else {
      const fetchUserInfo = async () => {
        try {
          const userInfo = await getUserInfo();
          setEmail(userInfo.email);
          setFirstName(userInfo.firstName);
          setLastName(userInfo.lastName);
          setPicture(userInfo.picture);
          setAge(userInfo.age);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logoutUser function
      logout(); // Call the logout function from AuthContext
      navigate("/auth/login"); // Redirect to the login page
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {isAuthenticated ? (
        <div className="profileInfo">
          <p>You are authenticated!</p>
          {picture && (
            <img
              className="profileImage"
              src={picture}
              alt={`${firstName} ${lastName}`}
            />
          )}
          <p>
            Your name is: {firstName} {lastName}
          </p>
          <p>Your age is: {age}</p>
          <p>Your email is: {email}</p>
        </div>
      ) : (
        <p>You are not authenticated.</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
