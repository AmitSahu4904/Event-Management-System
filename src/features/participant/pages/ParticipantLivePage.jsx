import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/authStore';
import { useEvent } from '../../../context/EventContext';
import { ROUTES } from '../../../shared/constants/routes';
import { FlipClock } from '../../../components/ui/FlipClock';
import { PrizeCard } from '../../../components/ui/PrizeCard';
import { Clock, Trophy, PartyPopper, Award, Users, Ticket, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { CountdownTimer } from '../../../components/common/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatDateTime, parseEventDate } from '../../../utils/formatters';

export const ParticipantLivePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { eventsList, activeEventId, eventData, realParticipantCount, prizes, winners, currentUserTicket, registrations } = useEvent();

  // Resolve current active event details
  const currentEvent = eventData?.name 
    ? eventData 
    : (eventsList && eventsList.length > 0 
        ? (eventsList.find(e => e.id === activeEventId) || eventsList[0]) 
        : null);

  // Guard: if not authenticated, redirect to /join
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(ROUTES.JOIN);
    }
  }, [isAuthenticated, user, navigate]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine Event Time Phase from exact scheduled dates using safe parser
  const parsedStart = parseEventDate(currentEvent?.startDate);
  const parsedEnd = parseEventDate(currentEvent?.endDate);

  const start = parsedStart || new Date(Date.now() - 3600000);
  const end = parsedEnd || new Date(Date.now() + 86400000);

  const isBeforeStart = parsedStart ? (currentTime < parsedStart) : false;
  const isAfterEnd = parsedEnd ? (currentTime > parsedEnd) : false;
  const isDuringEvent = !isBeforeStart && !isAfterEnd;

  // Active published winners list (only revealed after event end)
  const activeWinners = isAfterEnd ? winners : [];
  const [selectedRank, setSelectedRank] = useState(1);

  // Active winner for selected rank
  const activeWinner = activeWinners.find(w => w.rank === selectedRank);
  const activePrize = prizes.find(p => p.rank === selectedRank);

  // Determine displayed invoice number (only after event end)
  const invoiceNumber = (isAfterEnd && activeWinner?.invoiceNo) ? activeWinner.invoiceNo : (winners.find(w => w.rank === 1)?.invoiceNo || "000");
  const drawTime = activeWinner?.drawTime ? formatDateTime(activeWinner.drawTime) : formatDateTime(end);

  const myTicket = (currentUserTicket && currentUserTicket.phone === user?.phone)
    ? currentUserTicket
    : (registrations.find(p => p.phone === user?.phone) || null);

  const userInvoice = myTicket?.invoiceNo || '';
  const isMyTicketWinner = isAfterEnd && activeWinner && (
    activeWinner.invoiceNo === userInvoice || 
    (activeWinner.phone && activeWinner.phone.includes(user?.phone)) ||
    (activeWinner.participantIds && myTicket?.id && activeWinner.participantIds.includes(myTicket.id))
  );

  // Fire confetti celebration only after event has ended
  useEffect(() => {
    if (isAfterEnd) {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  }, [selectedRank, isAfterEnd]);

  const eventName = currentEvent?.name || "LUCKY DRAW EVENT";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* 1. TOP BANNER SECTION WITH DYNAMIC TIME LIFECYCLE */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white rounded-3xl p-4 sm:p-8 shadow-xl space-y-6 border border-blue-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Dynamic Status Badge */}
              {isBeforeStart && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                  <Clock size={14} /> UPCOMING
                </span>
              )}
              {isDuringEvent && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  LIVE IN PROGRESS
                </span>
              )}
              {isAfterEnd && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                  <CheckCircle2 size={14} /> EVENT COMPLETED
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-bold border border-white/10">
                <Users size={14} className="text-sky-400" /> {realParticipantCount || 0} Participants
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">{eventName}</h1>
            <p className="text-xs sm:text-sm text-blue-200 font-medium max-w-xl">
              {currentEvent?.description || 'Grand Prize Draw Event'}
            </p>
          </div>

          {/* Reserved Ticket Pill Card */}
          {userInvoice && (
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-lg shadow-md flex-shrink-0">
                <Ticket size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">YOUR RESERVED TICKET</span>
                <span className="text-lg sm:text-xl font-black text-white">#{userInvoice}</span>
                <span className="text-[11px] text-blue-200 block font-medium truncate">{user?.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Countdown Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs font-bold">
          {isBeforeStart && (
            <>
              <span className="flex items-center gap-2 text-amber-300">
                <Clock size={16} /> Event Scheduled To Start At: {formatDateTime(start)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white">Starts In:</span>
                <CountdownTimer targetDate={start.toISOString()} />
              </div>
            </>
          )}

          {isDuringEvent && (
            <span className="flex items-center gap-2 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Event Scheduled End: {formatDateTime(end)}
            </span>
          )}

          {isAfterEnd && (
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-emerald-300">
              <span className="flex items-center gap-2 text-xs"><CheckCircle2 size={16} className="flex-shrink-0" /> Event Completed — Official Winners Announced Below</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-black border border-emerald-500/30 self-start sm:self-auto">Official Results</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN STAGE CONTENT */}
      <div className="bg-white border-4 border-white rounded-3xl p-4 sm:p-6 shadow-xl space-y-6 overflow-hidden">
        
        {/* Stage Display */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedRank + (isAfterEnd ? 'winners' : 'countdown')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* CENTER STAGE: Countdown during event; FlipClock & Winners after event end */}
            {!isAfterEnd ? (
              <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-3.5 sm:p-8 border-2 sm:border-4 border-blue-800/50 shadow-2xl flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest border border-amber-400/30">
                  <Clock size={15} /> Live Draw Countdown
                </div>

                <h3 className="text-xs sm:text-base font-extrabold text-blue-200 uppercase tracking-wider">
                  {isBeforeStart ? "Official Draw Starts In" : "Official Draw Ends In"}
                </h3>

                {/* Big Animated Hero Countdown Display */}
                <div className="py-1 sm:py-2 max-w-full overflow-hidden">
                  <CountdownTimer 
                    targetDate={(isBeforeStart ? start : end).toISOString()} 
                    size="large"
                  />
                </div>

                <p className="text-[11px] sm:text-xs text-slate-300 font-medium max-w-md">
                  Winning invoice numbers and official winner names will be revealed here immediately after the event ends at <strong className="text-white">{formatDateTime(end)}</strong>.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-3.5 sm:p-8 rounded-3xl text-white border-2 sm:border-4 border-blue-800/50 shadow-2xl">
                <span className="text-[10px] sm:text-xs font-black uppercase text-amber-300 tracking-widest bg-amber-400/20 px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/30 text-center">
                  🏆 OFFICIAL WINNING INVOICE NUMBER
                </span>
                <div className="flex justify-center py-2 max-w-full overflow-hidden">
                  <FlipClock number={invoiceNumber} />
                </div>
              </div>
            )}

            {/* SPOTLIGHT WINNER CARD: Hidden winner name during event; Revealed after event end */}
            <div className={`border-2 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs text-center md:text-left transition-all ${
              isMyTicketWinner ? 'bg-emerald-50 border-emerald-300 ring-4 ring-emerald-200' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                  isAfterEnd ? 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isAfterEnd ? <Trophy size={30} /> : <Lock size={26} />}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-emerald-600 tracking-widest uppercase">
                    <span>★</span>
                    <span>RANK {selectedRank} WINNER</span>
                    <span>★</span>
                  </div>

                  {isAfterEnd ? (
                    <>
                      <h2 className="text-xl sm:text-3xl font-black text-blue-900 flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span>{activeWinner?.name || "Official Winner"}</span>
                        {isMyTicketWinner && (
                          <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            YOU WON! 🎉
                          </span>
                        )}
                      </h2>
                      <p className="text-xs font-bold text-slate-600 mt-1">
                        Invoice: <strong className="text-blue-900">#{activeWinner?.invoiceNo || '---'}</strong> | Prize: <strong className="text-blue-900">{activePrize?.name || `Rank ${selectedRank}`}</strong>
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-400">Winner Revealed At Event End</h2>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Prize: <strong className="text-slate-700">{activePrize?.name || `Rank ${selectedRank}`}</strong> | Winner names unlocked after event completion
                      </p>
                    </>
                  )}
                </div>
              </div>

              {isAfterEnd && (
                <div className="flex items-center justify-center gap-2 w-full md:w-auto">
                  <div className="flex flex-wrap justify-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(rank => (
                      <button
                        key={rank}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          selectedRank === rank ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                        onClick={() => setSelectedRank(rank)}
                      >
                        Rank {rank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3. PRIZES GALLERY (Ranks 1 to 5) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <span className="text-xs font-black text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Prizes (Ranks 1 to 5)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {prizes.map((p) => {
              const isSelected = selectedRank === p.rank;
              const rankWinner = isAfterEnd ? activeWinners.find(w => w.rank === p.rank) : null;

              return (
                <PrizeCard 
                  key={p.rank}
                  rank={p.rank}
                  name={p.name}
                  image={p.image}
                  isSelected={isSelected}
                  isWinnerRevealed={isAfterEnd}
                  winnerName={rankWinner?.name}
                  onClick={() => setSelectedRank(p.rank)}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
