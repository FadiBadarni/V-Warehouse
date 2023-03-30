import { useState, useEffect } from "react";
import { getBorrowRequests, updateRequestStatus } from "../api/AdminService";

const useBorrowRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [awaitingPickupRequests, setAwaitingPickupRequests] = useState([]);
  const [pendingReturnRequests, setPendingReturnRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getBorrowRequests();

        // Separate the requests based on their status
        const pending = [];
        const waitingForPickup = [];
        const pendingReturn = [];
        const closed = [];

        requests.forEach((request) => {
          switch (request.status) {
            case "PENDING":
              pending.push(request);
              break;
            case "AWAITING_PICKUP":
              waitingForPickup.push(request);
              break;
            case "AWAITING_RETURN":
              pendingReturn.push(request);
              break;
            case "CANCELLED":
            case "RETURNED":
            case "OVERDUE_RETURN":
            case "REJECTED":
              closed.push(request);
              break;
            default:
              break;
          }
        });

        setPendingRequests(pending);
        setAwaitingPickupRequests(waitingForPickup);
        setPendingReturnRequests(pendingReturn);
        setClosedRequests(closed);
      } catch (error) {
        console.error("Error fetching warehouse items:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "AWAITING_PICKUP"
      );

      setPendingRequests((prevPendingRequests) =>
        prevPendingRequests.filter((req) => req.requestId !== request.requestId)
      );
      setAwaitingPickupRequests((prevWaitingForPickupRequests) => [
        ...prevWaitingForPickupRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const handlePickupConfirm = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "AWAITING_RETURN"
      );

      setAwaitingPickupRequests((prevWaitingForPickupRequests) =>
        prevWaitingForPickupRequests.filter(
          (req) => req.requestId !== request.requestId
        )
      );
      setPendingReturnRequests((prevPendingReturnRequests) => [
        ...prevPendingReturnRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const handlePickupCancel = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "CANCELLED"
      );

      setAwaitingPickupRequests((prevWaitingForPickupRequests) =>
        prevWaitingForPickupRequests.filter(
          (req) => req.requestId !== request.requestId
        )
      );
      setClosedRequests((prevClosedRequests) => [
        ...prevClosedRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const handleReturn = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "RETURNED"
      );

      setPendingReturnRequests((prevPendingReturnRequests) =>
        prevPendingReturnRequests.filter(
          (req) => req.requestId !== request.requestId
        )
      );
      setClosedRequests((prevClosedRequests) => [
        ...prevClosedRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const handleOverDue = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "OVERDUE_RETURN"
      );

      setPendingReturnRequests((prevPendingReturnRequests) =>
        prevPendingReturnRequests.filter(
          (req) => req.requestId !== request.requestId
        )
      );
      setClosedRequests((prevClosedRequests) => [
        ...prevClosedRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const handleReject = async (request) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        "REJECTED"
      );

      setPendingRequests((prevPendingRequests) =>
        prevPendingRequests.filter((req) => req.requestId !== request.requestId)
      );
      setClosedRequests((prevClosedRequests) => [
        ...prevClosedRequests,
        updatedRequest,
      ]);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  return {
    pendingRequests,
    awaitingPickupRequests,
    pendingReturnRequests,
    closedRequests,
    handleAccept,
    handleReject,
    handlePickupConfirm,
    handlePickupCancel,
    handleReturn,
    handleOverDue,
  };
};

export default useBorrowRequests;
