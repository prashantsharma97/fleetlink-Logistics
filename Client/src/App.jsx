import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      <Route
        path="/dashboard"
        element={ 
          <ProtectedRoute>
          
            <Dashboard />
          </ProtectedRoute>
        }
      />  

      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Router>
        <AuthProvider>  
          <AppContent />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;