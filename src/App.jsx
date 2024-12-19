import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import WorkerDetailsPage from "./pages/WorkerDetailsPage";
import ManageWorkersPage from "./pages/ManageWorkersPage";

const App = () => {
  return (
    <Router>
      {/* Fixed Header */}
      <Header />
      
      {/* Routes Configuration */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/worker-details" element={<WorkerDetailsPage />} />
        <Route path="/manage-workers" element={<ManageWorkersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
