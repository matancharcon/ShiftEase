import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LogIn.module.css';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const url = "http://localhost:5000/login";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, { email, password });
            console.log("Response Data:", response.data); 
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('isAdmin', response.data.is_admin); 
                console.log("is admin is:"+response.data.is_admin)
                navigate('/home');
                window.location.reload();
            } else {
                setError('Failed to receive access token.');
            }
        } catch (err) {
            console.error("Login Error:", err); // Log full error
            if (err.response && err.response.data) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email address"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LogIn;
