import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/authStore';
import { useEvent } from '../../../context/EventContext';
import { ROUTES } from '../../../shared/constants/routes';
import { Sparkles, User, Phone, ArrowRight, Gift, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const ParticipantJoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selfRegisterUser, user } = useAuthStore();
  const { eventsList, activeEventId, setActiveEvent, eventData, checkUserTicketByPhone } = useEvent();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Auto-resolve event from URL query parameter (e.g. ?event=flipkart-lucky-draw)
  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam && eventsList && eventsList.length > 0) {
      const matchedEvent = eventsList.find(e => 
        (e.slug && e.slug.toLowerCase() === eventParam.toLowerCase()) || 
        (e.eventSlug && e.eventSlug.toLowerCase() === eventParam.toLowerCase()) ||
        e.id === eventParam
      );
      if (matchedEvent && matchedEvent.id !== activeEventId) {
        setActiveEvent(matchedEvent.id);
      }
    }
  }, [searchParams, eventsList, activeEventId]);

  // Event Lifecycle Status Computation
  const now = new Date();
  const start = eventData?.startDate ? new Date(eventData.startDate) : new Date(Date.now() - 3600000);
  const end = eventData?.endDate ? new Date(eventData.endDate) : new Date(Date.now() + 86400000);

  const isBeforeStart = now < start;
  const isAfterEnd = now > end;
  const isLive = now >= start && now <= end;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter both your name and phone number');
      return;
    }

    if (isBeforeStart) {
      toast.error(`Event has not started yet. Registration opens at ${start.toLocaleTimeString()}`);
      return;
    }

    // 1. Authenticate / Register User in Session Store
    const res = selfRegisterUser(name.trim(), phone.trim());
    if (res.success) {
      // 2. Check if this phone number already has a reserved ticket in active event
      const existingTicket = checkUserTicketByPhone(phone.trim());

      if (existingTicket) {
        toast.success(`Welcome back, ${name.trim()}! Ticket #${existingTicket.invoiceNo} loaded.`);
        navigate(ROUTES.JOIN_LIVE);
      } else if (isAfterEnd) {
        toast.error('Event has ended. New registration is closed.');
      } else {
        toast.success(`Welcome, ${name.trim()}! Select your lucky 3-digit invoice number.`);
        navigate(ROUTES.JOIN_PICK);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 space-y-6">
      {/* Event Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl text-center space-y-4 border border-blue-800">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
          <Sparkles size={28} className="text-amber-400 logo-sparkle" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isBeforeStart && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Clock size={12} /> UPCOMING
              </span>
            )}
            {isLive && (
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span> LIVE NOW
              </span>
            )}
            {isAfterEnd && (
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <CheckCircle2 size={12} /> COMPLETED
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{eventData?.name || 'Botivate Lucky Draw'}</h1>
          <p className="text-xs text-blue-200 font-medium mt-1 max-w-sm mx-auto">
            {eventData?.description || 'Annual Grand Prize Draw Event'}
          </p>
        </div>

        {/* Sponsor & Venue Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-300 border-t border-white/10">
          {eventData?.sponsor && (
            <span className="flex items-center gap-1.5"><Gift size={14} className="text-amber-400" /> {eventData.sponsor}</span>
          )}
          {eventData?.venue && (
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-sky-400" /> {eventData.venue}</span>
          )}
        </div>
      </div>

      {/* Dynamic Lifecycle Banner */}
      {isBeforeStart && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-800 text-xs font-bold flex items-center gap-3">
          <Clock size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <div className="font-extrabold text-amber-900">Event Scheduled To Start At:</div>
            <div>{start.toLocaleString()}</div>
          </div>
        </div>
      )}

      {isAfterEnd && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-extrabold text-emerald-900">Event Has Completed</div>
            <div>Winning roster and results are published on the live broadcast page.</div>
          </div>
        </div>
      )}

      {/* Participant Name + Phone Entry Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
            <User size={22} className="text-blue-600" /> Step 1: Join Event
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Enter your details to reserve your 3-digit lucky invoice number.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Full Name</label>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <User size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Phone Number</label>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <Phone size={18} className="text-slate-400" />
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isBeforeStart}
            className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
              isBeforeStart 
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-blue-900 hover:bg-blue-950 text-white'
            }`}
          >
            {isBeforeStart ? (
              <>
                <Clock size={18} />
                <span>Registration Opens When Live ({start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </>
            ) : (
              <>
                <span>Continue to Select Invoice Number</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
