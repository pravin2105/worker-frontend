import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="home-wrapper">
      <div className="button-container">
        <Link to="/worker-details">
          <button className="big-btn btn-blue">Worker Details</button>
        </Link>
        <Link to="/manage-workers">
          <button className="big-btn btn-green">Manage Workers</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
