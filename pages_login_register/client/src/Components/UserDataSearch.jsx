import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Logo/logo.png';
import './Css/UserDataSearch.css';

const UserDataSearch = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      setUserData(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in. Please log in to continue.');
          return;
        }

        // Fetch user details
        const userResponse = await axios.get('http://localhost:3001/api/user-details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const { email } = userResponse.data;

        // Fetch user data based on email
        const dataResponse = await axios.get('http://localhost:3001/api/formdata', {
          params: { email },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUserData(dataResponse.data);
      } catch (error) {
        if (error.response) {
          console.error('Error fetching user data:', error.response.data);
          setError(error.response.data.message || 'Failed to fetch data. Please try again.');
        } else if (error.request) {
          console.error('Error fetching user data:', error.request);
          setError('Failed to connect to the server. Please try again.');
        } else {
          console.error('Error fetching user data:', error.message);
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="">Pending</span>;
      case 'Approved':
        return <span className="">Approved</span>;
      case 'Rejected':
        return <span className="">Rejected</span>;
      default:
        return <span className="">Pending</span>;
    }
  };

  const renderUserData = () => {
    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>No data found for the logged-in user.</p>;

    return (
      <div className="user-data mt-4">
        <h3 className="font-weight-bold">Your Submission History</h3>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Submission Date</th>
              <th>Submission Time</th>
              <th>Website URL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item, index) => {
              const date = new Date(item.certificateUploadDate);
              return (
                <tr key={index}>
                  <td>{date.toLocaleDateString()}</td>
                  <td>{date.toLocaleTimeString()}</td>
                  <td>{item.websiteURL}</td>
                  <td>{renderStatus(item.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container bg-light p-5">
      <div className="heading-container text-center mb-4">
        <h2 className="font-weight-bold">User Submission History</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {renderUserData()}
      <div className="table-footer mt-4 text-center">
        <p>Current Date and Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserDataSearch;
