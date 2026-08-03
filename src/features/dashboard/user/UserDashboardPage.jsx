import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/context/EventContext';
import { useAuthStore } from '../../auth/authStore';
import { Ticket, Trophy, ArrowRight, Sparkles, Award } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { LiveBadge } from '@/shared/components/LiveBadge';
import { CountdownTimer } from '@/shared/components/CountdownTimer';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { eventData, currentUserTicket, winners, realParticipantCount, prizes } = useEvent();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Welcome back, <span className="text-amber-300">{user?.name || 'Participant'}</span>!</h1>
          <p className="text-xs font-medium opacity-90 mt-1">Reserve your lucky invoice number (000–999) to enter the live prize draw.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <Sparkles size={24} className="text-amber-300 logo-sparkle" />
        </div>
      </div>

      {/* Current Event Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <LiveBadge isLive={eventData.status === 'LIVE'} participantCount={realParticipantCount} />
          <CountdownTimer startDate={eventData.startDate} targetDate={eventData.endDate} />
        </div>

        <h2 className="text-xl font-black text-blue-900">{eventData.name || 'DIVINE EMPIRE INDIA'}</h2>
        <p className="text-xs font-semibold text-slate-500">{eventData.description || 'Grand Annual Prize Draw Event'}</p>
      </div>

      {/* Ticket Widget vs CTA */}
      {currentUserTicket ? (
        <div className="bg-white border-2 border-dashed border-blue-600 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider mb-4">
            <Ticket size={18} />
            <span>Your Reserved Ticket</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-3xl font-black text-blue-900 bg-blue-50 px-5 py-2 rounded-xl border border-blue-100 w-fit">
              #{currentUserTicket.invoiceNo}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-800">{currentUserTicket.name}</span>
              <span className="text-xs text-slate-500 font-semibold">{currentUserTicket.phone}</span>
            </div>
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 transition-all cursor-pointer"
              onClick={() => navigate(ROUTES.MY_TICKET)}
            >
              View Full Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-blue-900">You haven't reserved an invoice number yet!</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1">Choose your lucky 3-digit number from 000 to 999 to enter the prize draw.</p>
          </div>

          <button 
            type="button" 
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            onClick={() => navigate(ROUTES.RESERVE)}
          >
            <span>Reserve Number Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Winners Roster Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-blue-900 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            5 Rank Winners Roster
          </h3>
          <button 
            type="button" 
            className="text-xs font-bold text-blue-600 hover:text-blue-900 cursor-pointer"
            onClick={() => navigate(ROUTES.USER_WINNERS)}
          >
            View All Ranks
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {prizes.map((prize) => {
            const winner = winners.find(w => w.rank === prize.rank);

            return (
              <div key={prize.rank} className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 px-2 py-0.5 text-white font-extrabold text-[10px] rounded-br-md" 
                  style={{ backgroundColor: prize.colorTheme || '#0052cc' }}
                >
                  Rank {prize.rank}
                </div>
                <div className="font-extrabold text-xs text-slate-800 uppercase mt-4 truncate">{prize.name}</div>
                {winner ? (
                  <div className="flex flex-col mt-2 text-xs">
                    <span className="font-black text-blue-600">#{winner.invoiceNo}</span>
                    <span className="font-bold text-slate-800 truncate">{winner.name}</span>
                  </div>
                ) : (
                  <div className="text-[10px] font-semibold text-slate-400 italic mt-3">Drawing Soon...</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
