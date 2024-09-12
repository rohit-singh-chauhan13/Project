import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import './Css/Home.css';

function Home() {
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    websiteURL: '',
    publicIP: '',
    hasLBIP: false,
    lbip: '',
    privateIP: '',
    certificate: null,
    applicationManager: '',
    hod: '',
    hog: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Add this line

  // Replace with your API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in. Please log in to continue.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/user-details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const { email, userId } = response.data;
        setFormData(prevState => ({
          ...prevState,
          email,
          userId
        }));
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
          setMessage('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          setMessage('Error fetching user data. Please try again.');
        }
      }
    };

    fetchUserData();
  }, [API_URL, navigate]);

  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const privateIpRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
  const fileRegex = /\.(pfx|zip)$/i;

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (formData.websiteURL && !urlRegex.test(formData.websiteURL)) {
      newErrors.websiteURL = 'Invalid URL format';
      valid = false;
    }

    if (formData.publicIP && !ipRegex.test(formData.publicIP)) {
      newErrors.publicIP = 'Invalid Public IP address format';
      valid = false;
    }

    if (formData.hasLBIP && formData.lbip && !ipRegex.test(formData.lbip)) {
      newErrors.lbip = 'Invalid LB IP address format';
      valid = false;
    }

    if (formData.privateIP && !privateIpRegex.test(formData.privateIP)) {
      newErrors.privateIP = 'Invalid Private IP address format';
      valid = false;
    }

    if (formData.certificate && !fileRegex.test(formData.certificate.name)) {
      newErrors.certificate = 'Only .pfx and .zip files are allowed';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setMessage('Please fix the errors before submitting.');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/upload-user`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.message) {
        navigate('/thank-you');
      }
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        setMessage('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setMessage('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="upload-certificate">
      <h2>Upload Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="websiteURL">Website URL:</label>
          <input
            type="text"
            id="websiteURL"
            name="websiteURL"
            value={formData.websiteURL}
            onChange={handleInputChange}
            required
          />
          {errors.websiteURL && <div className="error">{errors.websiteURL}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="publicIP">Public IP:</label>
          <input
            type="text"
            id="publicIP"
            name="publicIP"
            value={formData.publicIP}
            onChange={handleInputChange}
            required
          />
          {errors.publicIP && <div className="error">{errors.publicIP}</div>}
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="hasLBIP"
            name="hasLBIP"
            checked={formData.hasLBIP}
            onChange={handleInputChange}
          />
          <label htmlFor="hasLBIP">Does it have LB IP?</label>
        </div>
        {formData.hasLBIP && (
          <div className="form-group">
            <label htmlFor="lbip">LB IP:</label>
            <input
              type="text"
              id="lbip"
              name="lbip"
              value={formData.lbip}
              onChange={handleInputChange}
              required
            />
            {errors.lbip && <div className="error">{errors.lbip}</div>}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="privateIP">Private IP:</label>
          <input
            type="text"
            id="privateIP"
            name="privateIP"
            value={formData.privateIP}
            onChange={handleInputChange}
          />
          {errors.privateIP && <div className="error">{errors.privateIP}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="certificate">Certificate (.pfx or .zip only):</label>
          <input
            type="file"
            id="certificate"
            name="certificate"
            onChange={handleInputChange}
            required
          />
          {errors.certificate && <div className="error">{errors.certificate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="applicationManager">Application Manager:</label>
          <input
            type="text"
            id="applicationManager"
            name="applicationManager"
            value={formData.applicationManager}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hod">Head of Department:</label>
          <input
            type="text"
            id="hod"
            name="hod"
            value={formData.hod}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hog">Head of Group:</label>
          <input
            type="text"
            id="hog"
            name="hog"
            value={formData.hog}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Home;

