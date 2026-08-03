import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Ticket, 
  Hash, 
  History, 
  Trophy, 
  Tv, 
  User, 
  LogOut, 
  Sparkles 
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/features/auth/authStore';
import { CompanyLogo } from '@/shared/components/CompanyLogo';

export const UserSidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: Home },
    { label: 'My Ticket', path: ROUTES.MY_TICKET, icon: Ticket },
    { label: 'Reserve Number', path: ROUTES.RESERVE, icon: Hash },
    { label: 'Registration History', path: ROUTES.HISTORY, icon: History },
    { label: 'Winners Roster', path: ROUTES.USER_WINNERS, icon: Trophy },
    { label: 'Live Draw Screen', path: ROUTES.USER_LIVE, icon: Tv },
    { label: 'Profile Settings', path: ROUTES.PROFILE, icon: User }
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className={`fixed top-0 bottom-0 left-0 bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-200 shadow-sm ${collapsed ? 'w-18' : 'w-70'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-3.5 border-b border-slate-100 flex-shrink-0 overflow-hidden min-w-0">
        <CompanyLogo size={collapsed ? 'sm' : 'md'} showText={!collapsed} />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD}
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
