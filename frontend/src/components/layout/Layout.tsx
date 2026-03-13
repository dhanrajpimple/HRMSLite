import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/employees': return 'Employees';
      case '/attendance': return 'Attendance';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header 
          title={getTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
