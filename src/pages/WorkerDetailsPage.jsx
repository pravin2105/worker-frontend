import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WorkerDetailsPage.css";
import { useNavigate } from "react-router-dom";

const WorkerDetailsPage = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending or Descending
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/workers")
      .then((response) => {
        setWorkers(response.data);
        setFilteredWorkers(response.data); // Initialize filtered data
      })
      .catch((err) => console.error("Error fetching workers:", err.message));
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = workers.filter((worker) =>
      worker.name.toLowerCase().includes(value)
    );
    setFilteredWorkers(filtered);
  };

  // Sorting functionality
  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc"; // Toggle order
    setSortField(field);
    setSortOrder(order);

    const sortedData = [...filteredWorkers].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "date_of_birth" || field === "date_of_joining") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (order === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    setFilteredWorkers(sortedData);
  };

  return (
    <div className="worker-details-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        &#8592; Back to Homepage
      </button>

      {/* Page Title */}
      <h2 className="page-title">Worker Details</h2>

      {/* Search and Sort Controls */}
      <div className="controls">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by worker name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        {/* Sort Dropdown */}
        <div className="sort-controls">
          <select
            onChange={(e) => handleSort(e.target.value)}
            value={sortField}
            className="sort-dropdown"
          >
            <option value="">Sort By</option>
            <option value="employee_id">Employee ID</option>
            <option value="date_of_birth">Date of Birth</option>
            <option value="date_of_joining">Date of Joining</option>
          </select>

          {/* Sort Order Button */}
          <button className="sort-order-button" onClick={() => handleSort(sortField)}>
            {sortOrder === "asc" ? "⬆ ASC" : "⬇ DESC"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="worker-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Date of Birth</th>
              <th>Date of Joining</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.employee_id}</td>
                  <td>{worker.name}</td>
                  <td>{worker.department}</td>
                  <td>{worker.date_of_birth}</td>
                  <td>{worker.date_of_joining}</td>
                  <td>{worker.phone_number}</td>
                  <td>{worker.role}</td>
                  <td>{new Date(worker.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No workers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerDetailsPage;
