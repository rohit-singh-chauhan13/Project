import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Logo/logo.png'; // Ensure the path to the logo is correct

const SubmissionExists = () => {
  const navigate = useNavigate();
  const submissionTime = localStorage.getItem('submissionTime');

  useEffect(() => {
    if (!submissionTime) {
      navigate('/login'); // Redirect to login if no submission time found
    }
  }, [navigate, submissionTime]);

  return (
    <div className="container bg-light p-5 vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center mb-4">
        <div
          className="logo mb-4"
          style={{
            width: '150px', // Increased width
            height: '150px', // Increased height
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
        <h1 className="font-weight-bold text-primary">Submission Exists</h1>
      </div>
      <div className="bg-white p-5 rounded shadow" style={{ width: '400px' }}>
        <p className="text-primary">You have already submitted your certificate.</p>
        <p className="text-primary">Submission Date and Time: {submissionTime}</p>
        <p className="text-primary">Thank you!</p>
      </div>
    </div>
  );
};

export default SubmissionExists;
