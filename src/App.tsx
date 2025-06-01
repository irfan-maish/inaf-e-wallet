import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import ApplyCardPage from './pages/ApplyCardPage';
import MyEmailPage from './pages/MyEmailPage';
import MyCardPage from './pages/MyCardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/apply-card" element={<ApplyCardPage />} />
        <Route path="/my-email" element={<MyEmailPage />} />
        <Route path="/my-card" element={<MyCardPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;