import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MemberDashboard from './pages/MemberDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard Routes */}
                <Route path="/member-dashboard" element={<MemberDashboard />} />
                <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* Fallback wildcard redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;


