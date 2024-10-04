import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        user_type: 'waiter',
        password1: '',
        password2: '',
        is_admin: false
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
     const url = "http://localhost:5000/sign-up"; 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, formData);
            console.log('Sign up successful:', response.data);
            setSuccessMessage('Sign up successful!');
            setErrorMessage('');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
                setSuccessMessage('');
            } else {
                setErrorMessage('An unexpected error occurred.');
                setSuccessMessage('');
            }
            console.error('Error signing up:', error.response?.data || error.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h3 align="center">Sign Up</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="full_name"
                        name="full_name"
                        placeholder="Enter full name"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="user_type">User Type</label>
                    <select
                        className="form-control"
                        id="user_type"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                    >
                        <option value="waiter">Waiter</option>
                        <option value="bartender">Bartender</option>
                        <option value="shift_manager">Shift Manager</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="password1">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password1"
                        name="password1"
                        placeholder="Enter password"
                        value={formData.password1}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Password (Confirm)</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password2"
                        name="password2"
                        placeholder="Confirm password"
                        value={formData.password2}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="is_admin">Admin?</label>
                    <input
                        type="checkbox"
                        id="is_admin"
                        name="is_admin"
                        checked={formData.is_admin}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SignUp;
