import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import GroupPage from './pages/GroupPage'; // ✅ Import GroupPage

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const updatedToken = localStorage.getItem('token');
      setToken(updatedToken);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/groups" element={token ? <GroupPage /> : <Navigate to="/login" />} /> {/* ✅ NEW */}
      </Routes>
    </Router>
  );
}

export default App;
