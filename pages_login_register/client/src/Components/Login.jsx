import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Logo/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Use Vite's import.meta.env instead of process.env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error messages
    
    try {
      console.log('Attempting to log in with:', { email, password });
      const response = await axios.post(`${API_URL}/login`, { email, password });
      console.log('Server response:', response.data);
      
      if (response.data.token) {
        console.log('Login successful');
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Navigate to the home page
        navigate('/homepage');
      } else {
        console.log('Login failed, response:', response.data);
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setErrorMessage(err.response.data.message || "Server error");
      } else if (err.request) {
        console.error('No response received');
        setErrorMessage("No response from server");
      } else {
        console.error('Error setting up request:', err.message);
        setErrorMessage("Error setting up request");
      }
    }
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
          <h2 className="font-weight-bold">Login</h2>
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              value={password}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>
        <div className="text-center mb-3">
          <Link to="/register" className="text-decoration-none">
            Don't Have An Account? Sign Up
          </Link>
        </div>
        <Link
          to="/admin-login"
          className="btn btn-info w-100"
        >
          Admin Login
        </Link>
        {/* <Link
          to="/UserDataSearch"
          className="btn btn-info w-100"
        >
          Search Your Data
        </Link> */}
      </div>
    </div>
  );
}

export default Login;