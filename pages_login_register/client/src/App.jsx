import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import ThankYou from './Components/ThankYou';
import FormDataTable from './Components/FormDataTable';
import AdminLogin from './Components/AdminLogin';
import NotFound from './Components/Notfound';
import SubmissionExists from './Components/SubmissionExists';
import UserDataSearch from './Components/UserDataSearch';
import HomePage from './Components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (admin) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to='/login' />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/home' element={<Home/>} />
        <Route path='/thank-you' element={<ThankYou />} />
        <Route path='/formdata' element={<FormDataTable/>} />
        <Route path='/homepage' element={<HomePage/>} />
        <Route path='/admin-login' element={<AdminLogin onLogin={handleLogin} />} />
        <Route path='/submission-exists' element={<SubmissionExists />} />

        <Route path='/UserDataSearch' element={<UserDataSearch/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
