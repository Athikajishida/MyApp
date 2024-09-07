import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white font-bold">
          MyApp
        </Link>
        <div>
          {auth.user ? (
            <>
              <Link to="/" className="text-white mr-4">
                Home
              </Link>
              <Link to="/profile" className="text-white mr-4">
                Profile
              </Link>
              {auth.user.admin && ( 
                <Link to="/admin" className="text-white mr-4">
                  Admin Dashboard
                  
                </Link>
              )}
              <button onClick={handleLogout} className="text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white">
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
