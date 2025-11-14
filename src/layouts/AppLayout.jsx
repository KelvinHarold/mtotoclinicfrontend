// layouts/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNavigation from '../components/SideNavigation';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col md:flex-row" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {/* Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <SideNavigation onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;