import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle the Submit Form button click
  const handleSubmitForm = () => {
    navigate('/home'); // Redirect to /home
  };

  // Handle the Check Your Status button click
  const handleCheckStatus = () => {
    navigate('/UserDataSearch'); // Redirect to /UserDataSearch
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '0 10px',
              transition: 'background-color 0.3s',
            }}
            onClick={handleSubmitForm}
          >
            Submit Form
          </button>
        </div>
        <div>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              color: '#fff',
              backgroundColor: '#6c757d',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '0 10px',
              transition: 'background-color 0.3s',
            }}
            onClick={handleCheckStatus}
          >
            Check Your Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
