import { useState, useEffect, useCallback } from "react";
import { getBorrowRequests, updateRequestStatus } from "../api/AdminService";

const useBorrowRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [awaitingPickupRequests, setAwaitingPickupRequests] = useState([]);
  const [pendingReturnRequests, setPendingReturnRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);

  const fetchRequests = useCallback(async () => {
    try {
      const requests = await getBorrowRequests();
      sortRequestsByStatus(requests);
    } catch (error) {
      console.error("Error fetching warehouse items:", error);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const sortRequestsByStatus = (requests) => {
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
  };

  const updateRequestStatusAndState = async (request, newStatus) => {
    try {
      const updatedRequest = await updateRequestStatus(
        request.requestId,
        newStatus
      );
      updateRequestStates(request, updatedRequest, newStatus);
    } catch (error) {
      console.error(
        "An error occurred while updating borrow request status:",
        error
      );
      // Handle the error here, e.g. show an error message to the user
    }
  };

  const updateRequestStates = (request, updatedRequest, newStatus) => {
    const statusUpdateMap = {
      AWAITING_PICKUP: {
        removeFrom: setPendingRequests,
        addTo: setAwaitingPickupRequests,
      },
      AWAITING_RETURN: {
        removeFrom: setAwaitingPickupRequests,
        addTo: setPendingReturnRequests,
      },
      CANCELLED: {
        removeFrom: setAwaitingPickupRequests,
        addTo: setClosedRequests,
      },
      RETURNED: {
        removeFrom: setPendingReturnRequests,
        addTo: setClosedRequests,
      },
      OVERDUE_RETURN: {
        removeFrom: setPendingReturnRequests,
        addTo: setClosedRequests,
      },
      REJECTED: {
        removeFrom: setPendingRequests,
        addTo: setClosedRequests,
      },
    };

    const { removeFrom, addTo } = statusUpdateMap[newStatus];

    removeFrom((prevRequests) =>
      prevRequests.filter((req) => req.requestId !== request.requestId)
    );
    addTo((prevRequests) => [...prevRequests, updatedRequest]);
  };

  const handleAccept = (request) =>
    updateRequestStatusAndState(request, "AWAITING_PICKUP");
  const handlePickupConfirm = (request) =>
    updateRequestStatusAndState(request, "AWAITING_RETURN");
  const handlePickupCancel = (request) =>
    updateRequestStatusAndState(request, "CANCELLED");
  const handleReturn = (request) =>
    updateRequestStatusAndState(request, "RETURNED");
  const handleOverDue = (request) =>
    updateRequestStatusAndState(request, "OVERDUE_RETURN");
  const handleReject = (request) =>
    updateRequestStatusAndState(request, "REJECTED");

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
