import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from './UserSidebar';
import { Header } from '../shared/Header';

export const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <UserSidebar 
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${collapsed ? 'md:ml-18' : 'md:ml-70'}`}>
        <Header 
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
