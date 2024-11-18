import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../features/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, error, loading } = useSelector((state) => state.user);
  
    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (userInfo) {
            navigate('/home');  
        }
    }, [userInfo, navigate]);

    return (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={loading}>Login</button>
            </form>

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Login;