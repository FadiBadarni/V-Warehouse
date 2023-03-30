import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Button } from "semantic-ui-react";
import { logoutUser, getUserInfo } from "../../api/UserService";
import "semantic-ui-css/semantic.min.css";

import "./Dashboard.scss";

function Dashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [year, setYear] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/login");
    } else if (user) {
      const fetchUserInfo = async () => {
        try {
          const userInfo = await getUserInfo();
          if (userInfo && userInfo.status === "TokenExpired") {
            setShowModal(true);
          } else if (userInfo) {
            setEmail(userInfo.email);
            setUsername(userInfo.username);
            setYear(userInfo.year);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }
  }, [isAuthenticated, navigate, loading, user]);

  const handleCloseModal = () => {
    setShowModal(false);
    logoutUser();
    navigate("/auth/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Modal open={showModal} onClose={handleCloseModal} size="tiny">
        <Modal.Header>Session Expired</Modal.Header>
        <Modal.Content>
          <p>Your session has expired. Please log in again.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModal} primary>
            Log In
          </Button>
        </Modal.Actions>
      </Modal>
      {isAuthenticated ? (
        <>
          <div className="profile-banner">
            <div className="profile-details">
              <h1>{`${username}`}</h1>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Year:</strong> {year}
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
            {isAuthenticated && user && user.role.includes("TEACHER") && (
              <div className="sub-section">
                <h2>Teacher-specific section</h2>
                {/* Add content specific to teachers here */}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>You are not authenticated.</p>
      )}
    </div>
  );
}

export default Dashboard;
