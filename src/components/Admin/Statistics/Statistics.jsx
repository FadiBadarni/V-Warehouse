import React from "react";
import AdminLayout from "../AdminLayout";

import "./Statistics.scss";

const Statistics = () => {
  return (
    <div className="statistics" id="statistics">
      <AdminLayout></AdminLayout>
      <div className="hero-section">
        <h2>Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Total</th>
              <th>Loaned</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Camera</td>
              <td>25</td>
              <td>5</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Microphone</td>
              <td>15</td>
              <td>3</td>
              <td>12</td>
            </tr>
            <tr>
              <td>Laptop</td>
              <td>30</td>
              <td>10</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Projector</td>
              <td>10</td>
              <td>2</td>
              <td>8</td>
            </tr>
            <tr>
              <td>Headphones</td>
              <td>20</td>
              <td>5</td>
              <td>15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
