import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/Login/LogIn';
import Home from './components/Home';
import UserList from './components/adminOnly/UserList/UserList';
import SignUp from './components/adminOnly/SignUp';
import AvailabilityForm from './components/AvailabilityForm';   
import Navbar from './components/NavBar';
import SelectWaitersAvailability from './components/adminOnly/SelectWaitersAvailability';
import SelectBartendersAvailability from './components/adminOnly/SelectBartendersAvailability';
import SelectShiftManagersAvailability from './components/adminOnly/SelectManagersAvailability';
import './App.css'; 

const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/availabilityform" element={<AvailabilityForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/admin/waiters" element={<SelectWaitersAvailability />} />
                <Route path="/admin/bartenders" element={<SelectBartendersAvailability />} />
                <Route path="/admin/shift_managers" element={<SelectShiftManagersAvailability />} />

                    

            </Routes>
        </Router>
    );
};

export default App;
