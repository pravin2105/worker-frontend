import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import "./ManageWorkersPage.css";

<Link to="/">
  <button className="back-to-home-button">⬅ Back to Home</button>
</Link>

const ManageWorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone_number: "",
    department: "",
    date_of_birth: "",
    date_of_joining: "",
    role: "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // New state for CSV file

  const [editId, setEditId] = useState(null);

  // Fetch all workers
  const fetchWorkers = () => {
    axios
      .get("http://localhost:5000/api/workers")
      .then((response) => {
        setWorkers(response.data);
      })
      .catch((err) => console.error("Error fetching workers:", err.message));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  
  const handleBulkUpload = () => {
    if (!selectedFile) {
      alert("Please select a CSV file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    // Debugging log: Ensure the selected file is being captured
    console.log("Uploading file:", selectedFile.name); 
  
    axios
      .post("http://localhost:5000/api/workers/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        alert(response.data); // Notify success
        setSelectedFile(null); // Reset file input
        fetchWorkers(); // Refresh workers list
      })
      .catch((err) => {
        console.error("Error uploading file:", err.message); // Debug error
        alert("Failed to upload CSV file. Please ensure the format is correct.");
      });
  };
  
  
  
  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewWorker({
      name: "",
      employee_id: "",
      email: "",
      phone_number: "",
      department: "",
      date_of_birth: "",
      date_of_joining: "",
      role: "",
    });
  };

  // Open modal
  const handleShowModal = () => setShowModal(true);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });
  };

  // Add or edit worker
  const handleAddOrEditWorker = () => {
    // Validation Logic
    const errors = [];
    const currentDate = new Date();
  
    if (!newWorker.name || !/^[a-zA-Z ]+$/.test(newWorker.name)) {
      errors.push("Name is required and should contain only letters.");
    }
    if (!newWorker.employee_id || newWorker.employee_id.length > 10) {
      errors.push("Employee ID is required and must be a maximum of 10 characters.");
    }
    if (!newWorker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newWorker.email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!newWorker.phone_number || !/^\d{10}$/.test(newWorker.phone_number)) {
      errors.push("Phone number must be exactly 10 digits.");
    }
    if (!newWorker.department) {
      errors.push("Department cannot be empty.");
    }
    if (!newWorker.date_of_birth || 
        new Date(newWorker.date_of_birth) > new Date(currentDate.setFullYear(currentDate.getFullYear() - 18))) {
      errors.push("Worker must be at least 18 years old.");
    }
    if (!newWorker.date_of_joining || new Date(newWorker.date_of_joining) > new Date()) {
      errors.push("Date of Joining cannot be a future date.");
    }
  
    // Display Validation Errors
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
  
    // Proceed with Add or Edit Logic
    if (isEditing) {
      axios
        .put("http://localhost:5000/api/workers/edit", { id: editId, ...newWorker })
        .then(() => {
          fetchWorkers();
          handleCloseModal();
        })
        .catch((err) => console.error("Error updating worker:", err.message));
    } else {
      axios
        .post("http://localhost:5000/api/workers/add", newWorker)
        .then(() => {
          fetchWorkers();
          handleCloseModal();
        })
        .catch((err) => console.error("Error adding worker:", err.message));
    }
  };
  
  // Edit worker handler
  const handleEditWorker = (id, index) => {
    setIsEditing(true);
    setEditId(id);
    setNewWorker(workers[index]);
    handleShowModal();
  };

  // Delete worker handler
  const handleDeleteWorker = (id) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      axios
        .delete("http://localhost:5000/api/workers/delete", { data: { id } })
        .then(() => fetchWorkers())
        .catch((err) => console.error("Error deleting worker:", err.message));
    }
  };


  
  return (
    <div className="manage-workers-container">
      <h2 className="page-title">Manage Workers</h2>
      <Button variant="success" className="add-worker-button" onClick={handleShowModal}>
        Add Worker
      </Button>
      <div className="bulk-upload-container">
      <input
        type="file"
        accept=".csv"
        className="csv-upload-input"
        onChange={(e) => {
          console.log("Selected file:", e.target.files[0]); // Debug selected file
          setSelectedFile(e.target.files[0]);
        }}
      />

  <Button
    variant="success"
    className="bulk-upload-button"
    onClick={handleBulkUpload}
    disabled={!selectedFile}
  >
    Upload CSV
  </Button>
</div>

      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Date of Birth</th>
              <th>Date of Joining</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.length > 0 ? (
              workers.map((worker, index) => (
                <tr key={worker.id}>
                  <td>{worker.employee_id}</td>
                  <td>{worker.name}</td>
                  <td>{worker.email}</td>
                  <td>{worker.phone_number}</td>
                  <td>{worker.department}</td>
                  <td>{worker.date_of_birth}</td>
                  <td>{worker.date_of_joining}</td>
                  <td>{worker.role}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="action-button"
                      onClick={() => handleEditWorker(worker.id, index)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="action-button"
                      onClick={() => handleDeleteWorker(worker.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No workers available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Worker" : "Add Worker"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(newWorker).map((key) => (
              <Form.Group controlId={`form${key}`} key={key}>
                <Form.Label>{key.replace(/_/g, " ").toUpperCase()}</Form.Label>
                <Form.Control
                  type={key.includes("date") ? "date" : "text"}
                  placeholder={`Enter ${key}`}
                  name={key}
                  value={newWorker[key]}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrEditWorker}>
            {isEditing ? "Update Worker" : "Add Worker"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageWorkersPage;
