import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Css/NotFound.css'; // Make sure to create and import this CSS file

const NotFound = () => {
  return (
    <div className="not-found-container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center bg-white p-5 rounded shadow">
        <h1 className="display-1 text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
        <Link to="/home" className="btn btn-primary btn-lg">Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
