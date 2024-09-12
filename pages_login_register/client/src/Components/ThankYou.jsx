import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Logo/logo.png';

const ThankYou = () => {
  const [countdown, setCountdown] = useState(10);
  const [submissionTime, setSubmissionTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    setSubmissionTime(formattedTime);

    const timer = setTimeout(() => {
      navigate('/login');
    }, countdown * 1000);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate, countdown]);

  return (
    <div className="container bg-light p-5 vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center mb-4">
        <div
          className="logo mb-4"
          style={{
            width: '150px',
            height: '150px',
            backgroundColor: '#0000FF',
            maskImage: `url(${logo})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: `url(${logo})`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            marginLeft: '20px',
          }}
        />
        <h1 className="font-weight-bold">Thank You!</h1>
      </div>
      <div className="bg-white p-5 rounded shadow" style={{ width: '400px' }}>
        <p>Your form has been submitted successfully.</p>
        <p>Submission Date and Time: {submissionTime}</p>
        <p>You will be redirected to the login page in {countdown} seconds...</p>
      </div>
    </div>
  );
};

export default ThankYou;