import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6"
      style={{ backgroundColor: '#0a66c2' }}
    >
      <h1 className="text-xl font-semibold text-white">
        FleetLink Dashboard
      </h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-white">
          <User className="h-5 w-5" />
          <span className="font-medium">
            {user?.name}
            </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
