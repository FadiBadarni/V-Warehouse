import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInfo } from "../../api/api";
import "./Dashboard.scss";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
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

  return (
    <div className="dashboard">
      {isAuthenticated ? (
        <>
          <div className="profile-banner">
            <img
              className="profileImage"
              src={picture}
              alt={`${firstName} ${lastName}`}
            />
            <div className="profile-details">
              <h1>{`${firstName} ${lastName}`}</h1>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Age:</strong> {age}
              </p>
            </div>
          </div>
          <div className="content">
            <div className="sub-section">
              <h2>Items On Loan</h2>
              <div className="items-container">
                {/* Create a grid of loaned items */}
                <div className="item-card">Item 1</div>
                <div className="item-card">Item 2</div>
                <div className="item-card">Item 3</div>
                <div className="item-card">Item 4</div>
                <div className="item-card">Item 5</div>
                <div className="item-card">Item 6</div>
              </div>
            </div>
            <div className="sub-section">
              <h2>Items Loaned</h2>
              <div className="items-container">
                {/* Create a grid of loaned items */}
                <div className="item-card">Item 1</div>
                <div className="item-card">Item 2</div>
                <div className="item-card">Item 3</div>
                <div className="item-card">Item 4</div>
                <div className="item-card">Item 5</div>
                <div className="item-card">Item 6</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>You are not authenticated.</p>
      )}
    </div>
  );
}

export default Dashboard;
