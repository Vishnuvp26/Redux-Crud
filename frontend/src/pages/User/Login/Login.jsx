import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, error, loading } = useSelector((state) => state.user);

    const nameRegex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?!.*\s)(?!.*[!@#$%^&*()_+=\[\]{};:"\\|,.<>/?]).+$/;

    const handleAuthSubmit = (e) => {
        e.preventDefault();

        if (!isLogin) {
            if (!nameRegex.test(name)) {
                toast.error('Enter a valid name more than 3 characters');
                return;
            }
        };

        if (!emailRegex.test(email)) {
            toast.error('Enter a valid email address!');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('Password cannot contain spaces or special characters!');
            return;
        }

        if (isLogin) {
            dispatch(loginUser({ email, password }));
        } else {
            if (!name) {
                toast.error('Name is required for registration!');
                return;
            }
            dispatch(registerUser({ name, email, password }));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate('/home');
        }
    }, [userInfo, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="backdrop-filter backdrop-blur-lg bg-white/5 p-8 rounded-xl shadow-lg max-w-sm w-full border border-white/20">
                <h2 className="text-2xl font-semibold text-center text-white-800 mb-6">{isLogin ? 'Sign In' : 'Create an Account'}</h2>
                
                <form className="space-y-4" onSubmit={handleAuthSubmit}>
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-500">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                required
                                className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-500">Email</label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-500">Password</label>
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
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

                <div className="mt-6 text-center text-sm text-gray-500">
                    <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sky-600 hover:underline ml-1"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false}/>
        </div>
    );
};

export default AuthPage;