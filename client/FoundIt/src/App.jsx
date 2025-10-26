import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AddLostItem from './components/AddLostItem';
import AddFoundItem from './components/AddFoundItem';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<HomePage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-lost" 
              element={
                <ProtectedRoute>
                  <AddLostItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-found" 
              element={
                <ProtectedRoute>
                  <AddFoundItem />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
