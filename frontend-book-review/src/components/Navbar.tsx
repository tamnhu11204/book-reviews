import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { House, LogOut, UserRound } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container  flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Book Review</Link>
        <div className="flex flex-row">
          <Link to="/" className="hover:underline"><House/></Link>
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className="hover:underline"><UserRound /></Link>
              <button onClick={handleLogout} className="hover:underline"><LogOut /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;