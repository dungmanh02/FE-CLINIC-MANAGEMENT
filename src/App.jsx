import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Index';
import Login from './Login';
import Register from './Register';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorExam from './pages/doctor/DoctorExam';
import PatientDashboard from './pages/patient/PatientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyAccount from './VerifyAccount';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import PatientProfile from './pages/patient/PatientProfile';
import AdminCreateDoctor from './pages/admin/AdminCreateDoctor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/exam" element={<DoctorExam />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/admin/create-doctor" element={<AdminCreateDoctor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;