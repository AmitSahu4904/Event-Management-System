import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, Ticket, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../features/auth/authStore';
import { useEvent } from '../../context/EventContext';
import { ROUTES } from '../../shared/constants/routes';

export const JoinLayout = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { currentUserTicket, eventData } = useEvent();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans">
      {/* Participant Top Header Bar */}
      <header className="h-16 bg-blue-950 text-white border-b border-blue-900 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
            <Sparkles size={18} className="text-amber-400 logo-sparkle" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm tracking-wider text-white">
              {eventData?.name || 'LUCKY DRAW'}
            </span>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              Live Participant Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <>
              {currentUserTicket?.invoiceNo && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-black">
                  <Ticket size={14} />
                  <span>Ticket #{currentUserTicket.invoiceNo}</span>
                </div>
              )}

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-[11px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <span className="hidden md:inline">{user.name}</span>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-95"
                onClick={handleLogout}
                title="Leave Event / Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}

          {!isAuthenticated && (
            <button
              type="button"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/15 cursor-pointer transition-all flex items-center gap-1.5"
              onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
            >
              <ShieldCheck size={14} /> Admin Portal
            </button>
          )}
        </div>
      </header>

      {/* Main Participant Screen Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <Outlet />
      </main>
    </div>
  );
};
