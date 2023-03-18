import React from "react";
import AdminLayout from "../AdminLayout";

import "./LoanManagement.scss";

const LoanManagement = () => {
  return (
    <div className="loan-management">
      <AdminLayout></AdminLayout>
      <div className="loan-section">
        <h2>Loan Management</h2>
        <ul>
          <li>
            John Doe - Camera - Due: 2023-04-01
            <button>Mark as Returned</button>
          </li>
          <li>
            Jane Smith - Laptop - Due: 2023-04-05
            <button>Mark as Returned</button>
          </li>
          <li>
            Mike Johnson - Projector - Due: 2023-04-07
            <button>Mark as Returned</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoanManagement;
