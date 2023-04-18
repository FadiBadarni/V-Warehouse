const customStatus = (status) => {
  switch (status) {
    case "RETURNED":
      return {
        text: status,
        style: {
          fontWeight: "bold",
          color: "green",
        },
      };
    case "OVERDUE_RETURN":
      return {
        text: "Returned Past Date",
        style: {
          fontWeight: "bold",
          color: "red",
        },
      };
    case "REJECTED":
      return {
        text: "Rejected",
        style: {
          fontWeight: "bold",
          color: "purple",
        },
      };
    case "CANCELLED":
      return {
        text: "Cancelled Pickup",
        style: {
          fontWeight: "bold",
          color: "red",
        },
      };
    default:
      return {
        text: status,
        style: {},
      };
  }
};

export default customStatus;
