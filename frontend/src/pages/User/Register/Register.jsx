import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../features/userSlice';
import { toast, Toaster } from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.user);

    const nameRegex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z0-9!@#$%^&*()_+=\[\]{};:"\\|,.<>/?-]).{6,}$/;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('All feilds are required');
            return
        }

        if (!nameRegex.test(name)) {
            toast.error('Enter a valid name more than 3 characters');
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error('Enter a valid email address!');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password must be at least 6 characters long and must not contain spaces.");
            return;
        }

        try {
            await dispatch(registerUser({ name, email, password })).unwrap();
            toast.success('Registration completed successfully!');
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6 text-white">
            <div className="backdrop-filter backdrop-blur-lg bg-white/5 p-8 rounded-xl shadow-lg max-w-sm w-full border border-white/20">
                <h2 className="text-2xl font-semibold text-center text-white-800 mb-6">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-500">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"

                                className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {showPassword ? (
                                    <AiFillEye size={19} />
                                ) : (
                                    <AiFillEyeInvisible size={19} />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{' '}
                    <a href="/" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default Register;