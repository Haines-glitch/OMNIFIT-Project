import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './components/Login/Login';

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={<LandingPage />} />

                {/* Login Page Route */}
                <Route path="/login" element={<Login />} />

                {/* Fallback wildcard redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

