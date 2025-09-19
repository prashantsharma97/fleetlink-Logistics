import React from 'react';
import { Plus, Search } from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'Booking List',
      label: 'Booking List',
      icon: Search,
    },
    {
      id: 'add-vehicle',
      label: 'Add Vehicle',
      icon: Plus,
    },
    {
      id: 'search-book',
      label: 'Search & Book',
      icon: Search,
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: isActive ? '#0a66c2' : 'transparent',
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
