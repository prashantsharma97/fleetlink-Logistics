import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import AddVehicle from '../components/AddVehicle';
import SearchAndBook from '../components/SearchAndBook';
import {BookingList} from '../components/BookingList';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('add-vehicle');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Booking List':
        return <BookingList />;
      case 'add-vehicle':
        return <AddVehicle />;
      case 'search-book':
        return <SearchAndBook />;
      default:
        return <AddVehicle />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
