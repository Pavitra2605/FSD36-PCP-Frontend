import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Access Window System
        </Link>

        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm">
                Welcome, {user?.name} ({user?.role})
              </span>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Admin Dashboard
                </Link>
              )}
              {user?.role === 'user' && (
                <Link to="/user" className="hover:bg-blue-700 px-3 py-2 rounded">
                  User Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
