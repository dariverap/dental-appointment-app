import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewAppointment from './pages/NewAppointment';
import { onAuthStateChange, logoutUser, getCurrentUserData } from './firebase/auth';
import './index.css';

// Firebase Authentication Hook
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userData = await getCurrentUserData(firebaseUser.uid);
          setUser({
            uid: firebaseUser.uid,
            name: userData?.name || firebaseUser.displayName || 'Usuario',
            email: firebaseUser.email
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            email: firebaseUser.email
          });
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuthenticated, user, loading, logout };
};

function App() {
  const { isAuthenticated, user, loading, logout } = useAuth();

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-dental-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue-600 mx-auto"></div>
          <p className="mt-4 text-dental-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-dental-gray-50">
        {isAuthenticated && <Navbar user={user} onLogout={logout} />}
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <Login /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? 
                <Register /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard user={user} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/new-appointment" 
            element={
              isAuthenticated ? 
                <NewAppointment user={user} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
