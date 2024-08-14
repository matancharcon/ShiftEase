import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin'); // Assuming 'isAdmin' is stored in local storage
  const navigate = useNavigate();
  console.log("Stored Token:", token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <span className="navbar-brand">ROBINA</span>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/availabilityform">Availability Form</Link>
                </li>
                {isAdmin === 'true' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/waiters">Waiters Availability</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/bartenders">Bartenders Availability</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/shift_managers">Shift Managers Availability</Link>
                    </li>
                    <li className="nav-item">
                  <Link className="nav-link" to="/users">User List</Link>
                    </li>
                    <li className="nav-item">
                  <Link className="nav-link" to="/sign-up">Sign Up</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
