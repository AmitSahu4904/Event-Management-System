import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, LogOut, User as UserIcon, Check, Trash2, ArrowRight, ShieldCheck, Ticket, Trophy, Gift, Calendar, Hash } from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { useEvent } from '../../context/EventContext';
import { ROUTES } from '../../shared/constants/routes';
import { toast } from 'sonner';

export const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, user, logout } = useAuthStore();
  const { 
    eventData, 
    registrations, 
    winners, 
    notifications, 
    markNotificationsRead, 
    clearNotifications,
    updateEventDetails 
  } = useEvent();

  const isAdminPage = location.pathname.startsWith('/admin');
  const currentUser = isAdminPage ? (adminUser || { name: 'System Admin', role: 'admin' }) : (user || { name: 'Participant', role: 'user' });

  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  
  // Real Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumb = pathSegments.length > 0
    ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
    : 'Dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate(isAdminPage ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN);
  };

  const handleThemeToggle = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);

    const nextTheme = nextDark ? 'dark' : 'light';
    updateEventDetails({
      settings: {
        ...(eventData?.settings || {}),
        theme: nextTheme
      }
    });

    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter real system search results
  const systemPages = [
    { title: 'System Overview Dashboard', path: ROUTES.ADMIN, icon: ShieldCheck, type: 'Page' },
    { title: 'Event Management & Schedule', path: ROUTES.EVENT, icon: Calendar, type: 'Page' },
    { title: 'Participant Roster & Management', path: ROUTES.ADMIN, icon: UserIcon, type: 'Page' },
    { title: 'Invoice Manager (000-999)', path: ROUTES.INVOICES, icon: Hash, type: 'Page' },
    { title: 'Winner Draw Engine', path: ROUTES.DRAW, icon: Trophy, type: 'Page' },
    { title: 'Published Winner History', path: ROUTES.ADMIN, icon: Trophy, type: 'Page' },
    { title: 'System Settings', path: ROUTES.SETTINGS, icon: UserIcon, type: 'Page' },
  ];

  const matchedPages = searchQuery.trim() === '' ? [] : systemPages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchedParticipants = searchQuery.trim() === '' ? [] : registrations.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.phone.includes(searchQuery) || r.invoiceNo.includes(searchQuery));
  const matchedWinners = searchQuery.trim() === '' ? [] : winners.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.invoiceNo.includes(searchQuery));

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 w-full">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button 
          type="button" 
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-all active:scale-95 flex-shrink-0" 
          onClick={onToggleSidebar}
          title="Toggle Navigation Sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold truncate">
          <span className="text-slate-400 hidden sm:inline">Home</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-blue-900 font-extrabold truncate">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Real Live Search Box */}
        <div className="relative hidden sm:block" ref={searchRef}>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl w-36 sm:w-48 lg:w-64 text-xs text-slate-600 border border-slate-200/50">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent outline-none w-full text-slate-800 placeholder-slate-400 truncate"
            />
          </div>

          {/* Real Live Search Results Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-11 left-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3 z-50 max-h-96 overflow-y-auto">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Search Results</div>

              {matchedPages.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Pages</span>
                  {matchedPages.map(p => (
                    <button
                      key={p.path}
                      type="button"
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-900 text-left cursor-pointer"
                      onClick={() => {
                        navigate(p.path);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <p.icon size={14} className="text-blue-600" /> {p.title}
                      </span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              )}

              {matchedParticipants.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Participants</span>
                  {matchedParticipants.slice(0, 4).map(r => (
                    <button
                      key={r.id || r.invoiceNo}
                      type="button"
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 text-left cursor-pointer"
                      onClick={() => {
                        navigate(ROUTES.ADMIN);
                        setShowSearchResults(false);
                      }}
                    >
                      <div>
                        <span className="font-black text-blue-900 me-2">#{r.invoiceNo}</span>
                        <span className="font-bold text-slate-800">{r.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{r.phone}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedPages.length === 0 && matchedParticipants.length === 0 && matchedWinners.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400 font-semibold">No results matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Real Notification Bell Popover */}
        <div className="relative">
          <button 
            type="button" 
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 relative cursor-pointer transition-all active:scale-95"
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowProfileMenu(false);
            }}
            title="System Logs & Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Real Notification Popover Menu */}
          {showNotificationMenu && (
            <div className="absolute top-12 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-black text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell size={14} /> System Activity Logs
                </span>
                {unreadCount > 0 && (
                  <button 
                    type="button" 
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      markNotificationsRead();
                    }}
                  >
                    <Check size={12} /> Mark Read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-semibold">No activity logs recorded.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${n.read ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-blue-50/70 border-blue-200 text-slate-900 font-medium'}`}>
                      <div className="font-bold">{n.text}</div>
                      <div className="text-[10px] text-slate-400 text-right">{n.time}</div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button 
                    type="button" 
                    className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      clearNotifications();
                    }}
                  >
                    <Trash2 size={12} /> Clear Logs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Real Theme Switcher */}
        <button 
          type="button" 
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
          onClick={handleThemeToggle}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-700" />}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button 
            type="button"
            className="flex items-center gap-3 border-none bg-transparent cursor-pointer"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationMenu(false);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-950 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="font-extrabold text-xs text-slate-800">{currentUser?.name || 'System Admin'}</span>
              <span className="text-[10px] font-semibold text-slate-500">{currentUser?.role === 'admin' ? 'System Admin' : 'Participant'}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-50">
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-900 w-full text-left cursor-pointer"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(currentUser?.role === 'admin' ? ROUTES.SETTINGS : ROUTES.JOIN_LIVE);
                }}
              >
                <UserIcon size={14} />
                <span>My Profile / Settings</span>
              </button>

              <button 
                type="button" 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
