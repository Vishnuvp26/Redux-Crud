import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../../features/adminSlice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { adminInfo, error, loading } = useSelector((state) => state.admin);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(adminLogin({ email, password }));
    };

    useEffect(() => {
        if (adminInfo) {
            navigate('/admin/dashboard');
        }
    }, [adminInfo, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-600 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="bg-white p-8 shadow-lg max-w-md w-full rounded-xl ">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;