import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Logo/logo.png'; // Ensure this path is correct

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/admin-login", { username, password })
      .then(response => {
        console.log(response.data); // Log the response data for debugging

        if (response.data.token) {
          // Token received, proceed with login
          console.log("Token received:", response.data.token);
          navigate('/formdata');
        } else if (response.data.error) {
          // Display the error message from the server
          setErrorMessage(response.data.error);
        } else {
          // Fallback error message if the response structure is unexpected
          setErrorMessage("Login failed. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-5 rounded shadow" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <div
            className="logo mb-4"
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto',
              backgroundColor: '#0000FF',
              maskImage: `url(${logo})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(${logo})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
            }}
          />
          <h2 className="font-weight-bold">Admin Login</h2>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label"><strong>Username</strong></label>
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              name="username"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
