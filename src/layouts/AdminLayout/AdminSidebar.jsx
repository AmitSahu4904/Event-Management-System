import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Hash, 
  Trophy, 
  Settings, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import { useAuthStore } from '../../features/auth/authStore';
import { useEvent } from '../../context/EventContext';

export const AdminSidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { eventData } = useEvent();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.ADMIN, icon: LayoutDashboard },
    { label: 'Event Management', path: ROUTES.EVENT, icon: Calendar },
    { label: 'System Settings', path: ROUTES.SETTINGS, icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <aside className={`fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-200 shadow-sm ${collapsed ? 'w-18' : 'w-70'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 flex-shrink-0">
        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs">
          <ShieldCheck size={20} className="text-blue-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-sm text-blue-900 tracking-wider">LUCKY DRAW</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Admin Console</span>
          </div>
        )}
      </div>

      {/* Active Event Indicator Pill */}
      {!collapsed && eventData && (
        <div className="px-3 pt-3 pb-1">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ACTIVE EVENT</span>
              <span className="font-extrabold text-blue-900 truncate">{eventData.name || 'Default Event'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.ADMIN}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                  isActive 
                    ? 'bg-blue-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-blue-900'
                }`
              }
              onClick={onCloseMobile}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-3 border-t border-slate-100">
        <button 
          type="button" 
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
