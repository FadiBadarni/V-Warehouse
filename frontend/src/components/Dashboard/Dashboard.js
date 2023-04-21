import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Button } from "semantic-ui-react";
import { Typography, Grid } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {
  logoutUser,
  getUserInfo,
  getBorrowRequestsByUserId,
} from "../../api/UserService";
import { motion } from "framer-motion";
import { getWarehouseItemById } from "../../api/WarehouseService";
import { cancelBorrowRequest } from "../../api/BorrowService";
import "semantic-ui-css/semantic.min.css";
import RequestDetails from "./RequestDetails";

import "./Dashboard.scss";

function Dashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [year, setYear] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState([]);

  const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
  const [currentDuePage] = useState(1);
  const itemsPerPage = 3;

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const userId = user && user.id;
        const requests = await getBorrowRequestsByUserId(userId);
        const requestsWithItem = await Promise.all(
          requests.map(async (request) => {
            const item = await fetchItem(request.itemId);
            return { ...request, item };
          })
        );
        setBorrowRequests(requestsWithItem);
      } catch (error) {
        console.error("Error fetching borrow requests:", error);
      }
    };

    if (user) {
      fetchBorrowRequests();
    }
  }, [user]);

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

  const fetchItem = async (itemId) => {
    try {
      const item = await getWarehouseItemById(itemId);
      return item;
    } catch (error) {
      console.error("Error fetching item :", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    logoutUser();
    navigate("/auth/login");
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelBorrowRequest(requestId);
      setBorrowRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requestId === requestId
            ? { ...request, status: "CANCELLED" }
            : request
        )
      );
    } catch (error) {
      console.error("Error cancelling the request:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentOngoingPage(value);
  };

  const handleMoreDetailsClick = (request) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
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
      <RequestDetails
        showModal={detailsModalOpen}
        request={selectedRequest}
        handleClose={handleCloseDetailsModal}
      />

      {isAuthenticated ? (
        <>
          <header className="profile-banner">
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>

            <div className="profile-details">
              <Typography variant="h3" gutterBottom>
                {username}
              </Typography>
              {year === 0 && user.role.includes("ADMIN") && (
                <Typography variant="body1">Site Adminstrator</Typography>
              )}
              {year === 0 && user.role.includes("TEACHER") && (
                <Typography variant="body1">Teacher</Typography>
              )}
              {year === 1 && (
                <Typography variant="body1">First Year Student</Typography>
              )}
              {year === 2 && (
                <Typography variant="body1">Second Year Student</Typography>
              )}
              {year === 3 && (
                <Typography variant="body1">Third Year Student</Typography>
              )}
              {year === 4 && (
                <Typography variant="body1">Fourth Year Student</Typography>
              )}
              <Typography variant="body1">{email}</Typography>
            </div>
          </header>
          <div className="custom-shape-divider-top-1681994798">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>

          <main className="content">
            <section className="ongoing-section">
              <Typography variant="h4" gutterBottom>
                Ongoing Requests
              </Typography>
              <Grid container spacing={3}>
                {borrowRequests
                  .filter(
                    (request) =>
                      request.status === "AWAITING_RETURN" ||
                      request.status === "AWAITING_PICKUP" ||
                      request.status === "PENDING"
                  )
                  .slice(
                    (currentOngoingPage - 1) * itemsPerPage,
                    currentOngoingPage * itemsPerPage
                  )
                  .map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request.requestId}>
                      <motion.div
                        className="item-card"
                        whilehover={{
                          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <div className="card">
                          <div className="card-header">
                            <span>ID: {request.requestId}</span>
                            <span>{request.item.name}</span>
                          </div>
                          <div className="card-content">
                            <p>
                              <strong>Request Made at:</strong>{" "}
                              {new Date(request.requestTime).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          <div className="card-actions">
                            <button
                              onClick={() => handleMoreDetailsClick(request)}
                            >
                              More Details
                            </button>
                            <button
                              onClick={() =>
                                handleCancelRequest(request.requestId)
                              }
                            >
                              Cancel Request
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </Grid>
                  ))}
              </Grid>
              <Pagination
                count={Math.ceil(
                  borrowRequests.filter(
                    (request) =>
                      request.status === "AWAITING_RETURN" ||
                      request.status === "AWAITING_PICKUP" ||
                      request.status === "PENDING"
                  ).length / itemsPerPage
                )}
                page={currentOngoingPage}
                onChange={handlePageChange}
                color="success"
                size="large"
                showFirstButton
                showLastButton
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              />
            </section>
            <section className="due-section">
              <Typography variant="h4" gutterBottom>
                Due Requests
              </Typography>
              <Grid container spacing={3}>
                {borrowRequests
                  .filter(
                    (request) =>
                      request.status === "RETURNED" ||
                      request.status === "OVERDUE_RETURN" ||
                      request.status === "CANCELLED" ||
                      request.status === "REJECTED"
                  )
                  .slice(
                    (currentDuePage - 1) * itemsPerPage,
                    currentDuePage * itemsPerPage
                  )
                  .map((request) => (
                    <Grid item xs={12} sm={6} md={4} key={request.requestId}>
                      <motion.div
                        className="item-card"
                        whilehover={{
                          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <div className="card">
                          <div className="card-header">
                            <span>ID: {request.requestId}</span>
                            <span>{request.item.name}</span>
                          </div>
                          <div className="card-content">
                            <p>
                              <strong>Request Made at:</strong>{" "}
                              {new Date(request.requestTime).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Grid>
                  ))}
              </Grid>
              <Pagination
                count={Math.ceil(
                  borrowRequests.filter(
                    (request) =>
                      request.status === "RETURNED" ||
                      request.status === "OVERDUE_RETURN" ||
                      request.status === "CANCELLED" ||
                      request.status === "REJECTED"
                  ).length / itemsPerPage
                )}
                page={currentDuePage}
                onChange={handlePageChange}
                color="success"
                size="large"
                showFirstButton
                showLastButton
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              />
            </section>
            {isAuthenticated && user && user.role.includes("TEACHER") && (
              <section className="sub-section teacher-section">
                <Typography variant="h5" gutterBottom>
                  Teacher-specific section
                </Typography>
                {/* Add content specific to teachers here */}
              </section>
            )}
          </main>
        </>
      ) : (
        <p>You are not authenticated.</p>
      )}
    </div>
  );
}

export default Dashboard;
