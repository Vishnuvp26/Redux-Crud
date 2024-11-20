import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/User/Login/Login';
import Home from './pages/User/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/Admin/Login/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } 
                />
                <Route path='/admin/login' element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;