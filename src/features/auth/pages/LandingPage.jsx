import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, Users, ShieldCheck, Ticket, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-950 text-white">
      {/* Header Navigation */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="text-amber-400 logo-sparkle" size={22} />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider block leading-none">LUCKY DRAW</span>
              <span className="text-[10px] font-semibold opacity-70">Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-all shadow-sm cursor-pointer flex items-center gap-1.5" 
              onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
            >
              <ShieldCheck size={16} /> Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Enterprise Event & Prize Draw Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Run Professional Live Prize Draws <br />
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">With Complete Transparency</span>
          </h1>

          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto font-medium">
            Manage events, 000–999 invoice registrations, 5-rank prizes, and execute 
            100% fair random winner selections live on screen.
          </p>

          <div className="flex justify-center pt-4">
            <button 
              type="button" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              onClick={() => navigate(ROUTES.JOIN)}
            >
              <span>Enter Participant Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-12">Core System Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Ticket size={24} />
              </div>
              <h3 className="text-lg font-bold">000–999 Invoice System</h3>
              <p className="text-xs opacity-75 font-medium leading-relaxed">Participants reserve unique numbers with instant state locking (one user per number).</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <h3 className="text-lg font-bold">5-Rank Winner Engine</h3>
              <p className="text-xs opacity-75 font-medium leading-relaxed">Sequential 5-winner random draw algorithm with pool depletion and draft redraw controls.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold">Live Broadcast View</h3>
              <p className="text-xs opacity-75 font-medium leading-relaxed">Broadcast-ready TV display screen with 3-digit flip clock, winner reveal, and rank showcase.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
