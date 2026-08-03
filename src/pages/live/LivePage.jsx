import React, { useState, useEffect } from 'react';
import { useEvent } from '@/context/EventContext';
import { FlipClock } from '@/features/draw/components/FlipClock';
import { PrizeCard } from '@/features/prizes/components/PrizeCard';
import { WheelSpinner } from '@/features/draw/components/WheelSpinner';
import { Clock, Trophy, PartyPopper, Award, Users, CheckCircle2, Gift, Lock, Sparkles } from 'lucide-react';
import { CountdownTimer } from '@/shared/components/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatDateTime } from '@/shared/utils/formatters';
import { winnerStorage } from '@/features/winners/services/winnerStorage';
import { CompanyLogo } from '@/shared/components/CompanyLogo';

export const LivePage = () => {
  const { eventsList, activeEventId, eventData, registrations, realParticipantCount, prizes, winners } = useEvent();
  
  // Resolve current active event details
  const currentEvent = eventData?.name 
    ? eventData 
    : (eventsList && eventsList.length > 0 
        ? (eventsList.find(e => e.id === activeEventId) || eventsList[0]) 
        : null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time-based phase check based on scheduled start and end times
  const start = currentEvent?.startDate ? new Date(currentEvent.startDate) : new Date();
  const end = currentEvent?.endDate ? new Date(currentEvent.endDate) : new Date();

  const isBeforeStart = currentTime < start;
  const isDuringEvent = currentTime >= start && currentTime <= end;
  const isAfterEnd = currentTime > end;

  // Active published winners list
  const activeWinners = winners || [];

  const [selectedRank, setSelectedRank] = useState(1);

  // Active winner for selected rank
  const activeWinner = activeWinners.find(w => w.rank === selectedRank);
  const activePrize = prizes.find(p => p.rank === selectedRank) || prizes[selectedRank - 1];

  const invoiceNumber = activeWinner?.invoiceNo ? activeWinner.invoiceNo : "000";

  const handleSpinWinner = (winnerParticipant) => {
    if (!winnerParticipant) return;
    const newWinnerEntry = {
      rank: selectedRank,
      prizeName: activePrize?.name || `Rank ${selectedRank} Reward`,
      invoiceNo: winnerParticipant.invoiceNo,
      name: winnerParticipant.name,
      phone: winnerParticipant.phone,
      participantIds: [winnerParticipant.id],
      participantsCount: 1,
      drawTime: new Date().toISOString(),
      published: true
    };

    const updated = winnerStorage.publishWinners(activeEventId, [...winners.filter(w => w.rank !== selectedRank), newWinnerEntry]);
    window.location.reload(); // Refresh context
  };
  const drawTime = activeWinner?.drawTime ? formatDateTime(activeWinner.drawTime) : formatDateTime(end.toISOString());

  // Fire confetti only when event has ended and winners are displayed
  useEffect(() => {
    if (isAfterEnd && activeWinner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  }, [selectedRank, isAfterEnd, activeWinner]);

  const timeString = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateString = currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const eventName = currentEvent?.name || "LUCKY DRAW EVENT";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white border-4 border-white rounded-3xl p-6 shadow-xl space-y-6 overflow-hidden">
        {/* Top Bar Header */}
        <header className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            {isBeforeStart && (
              <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-black text-xs tracking-wider shadow-xs">
                <Clock size={14} />
                <span>UPCOMING</span>
              </div>
            )}
            {isDuringEvent && (
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full font-black text-xs tracking-wider shadow-xs">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                <span>{currentEvent?.status || 'LIVE'}</span>
              </div>
            )}
            {isAfterEnd && (
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full font-black text-xs tracking-wider shadow-xs">
                <CheckCircle2 size={14} />
                <span>COMPLETED</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <Users size={16} className="text-blue-600" />
              <div className="flex flex-col leading-tight">
                <span className="font-black text-xs text-blue-900">{realParticipantCount || 0}</span>
                <span className="text-[10px] font-semibold text-slate-500">Live Viewers</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <CompanyLogo size="md" />
            <div className="flex items-center gap-3 mt-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-blue-900 hidden sm:block"></div>
              <h1 className="text-xl md:text-2xl font-black text-blue-900 tracking-wider uppercase text-center">{eventName}</h1>
              <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-blue-900 hidden sm:block"></div>
            </div>
            {currentEvent?.sponsor && (
              <span className="text-xs font-bold text-slate-500">Sponsored by: <strong className="text-blue-900">{currentEvent.sponsor}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2 text-blue-900">
            <Clock size={20} className="text-blue-600" />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xs">{timeString}</span>
              <span className="text-[10px] font-semibold text-slate-500">{dateString}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Countdown Status Banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700">
          {isBeforeStart && (
            <>
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-amber-500" /> Event Starts At: {start.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-600">Countdown to Start:</span>
                <CountdownTimer targetDate={start.toISOString()} />
              </div>
            </>
          )}

          {isDuringEvent && (
            <>
              <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Event In Progress (Scheduled End: {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-700">Live Draw Closes In:</span>
                <CountdownTimer targetDate={end.toISOString()} />
              </div>
            </>
          )}

          {isAfterEnd && (
            <div className="w-full flex items-center justify-between text-emerald-800 font-extrabold">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-emerald-600" /> Official Winner Draw Completed</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-black">All Ranks Published</span>
            </div>
          )}
        </div>

        {/* Rank Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: prizes && prizes.length > 0 ? prizes.length : 5 }, (_, i) => i + 1).map(rank => {
            const rankWinner = isAfterEnd ? activeWinners.find(w => w.rank === rank) : null;
            const rankPrize = prizes.find(p => p.rank === rank);

            return (
              <button
                key={rank}
                className={`flex flex-col items-center px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedRank === rank
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                onClick={() => setSelectedRank(rank)}
              >
                <span className="text-[10px] opacity-80 uppercase">Rank {rank}</span>
                <span className="font-extrabold">{rankPrize?.name || `Prize ${rank}`}</span>
                {isAfterEnd && rankWinner ? (
                  <span className="text-[10px] text-emerald-400 font-bold mt-0.5">🏆 {rankWinner.name}</span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                    <Lock size={10} /> Locked until end
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Stage: COUNTDOWN during event, INVOICE FLIP CLOCK after event end */}
        <main className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedRank + (isAfterEnd ? invoiceNumber : 'countdown')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* STAGE CENTER: WheelSpinner during Live Duration; Countdown before start; FlipClock after end */}
              {isDuringEvent ? (
                <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-blue-800/50 shadow-2xl flex flex-col items-center text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-400/30">
                    <Sparkles size={16} className="text-amber-400" /> LIVE REWARD SPINNER
                  </div>

                  <WheelSpinner 
                    participants={registrations}
                    activeRank={selectedRank}
                    prizeName={activePrize?.name || `Rank ${selectedRank} Reward`}
                    existingWinners={winners}
                    onSpinEnd={handleSpinWinner}
                  />
                </div>
              ) : isBeforeStart ? (
                <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 border-4 border-blue-800/50 shadow-2xl flex flex-col items-center text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-400/30">
                    <Clock size={16} /> Registration Window Open
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-blue-200 uppercase tracking-wider">
                    Official Live Draw Starts In
                  </h3>

                  <div className="py-2">
                    <CountdownTimer targetDate={start.toISOString()} size="large" />
                  </div>

                  <p className="text-xs text-slate-300 font-medium max-w-md">
                    Client registrations are being collected. The interactive wheel spinner will be enabled when live duration starts at <strong className="text-white">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-widest">OFFICIAL WINNING INVOICE NO.</span>
                  <div className="flex justify-center">
                    <FlipClock number={invoiceNumber} />
                  </div>
                </div>
              )}

              {/* SPOTLIGHT WINNER CARD: Hidden winner name during event; Revealed after event end */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs text-center md:text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                    isAfterEnd ? 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isAfterEnd ? <Trophy size={36} /> : <Lock size={30} />}
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 tracking-widest uppercase">
                      <span>★</span>
                      <span>RANK {selectedRank} WINNER</span>
                      <span>★</span>
                    </div>

                    {isAfterEnd ? (
                      <>
                        <h2 className="text-3xl font-black text-blue-900">{activeWinner?.name || "Official Winner"}</h2>
                        <p className="text-xs font-bold text-slate-600 mt-1">
                          Invoice: <strong className="text-blue-900">#{activeWinner?.invoiceNo || '---'}</strong> | Prize: <strong className="text-blue-900">{activePrize?.name || `Rank ${selectedRank}`}</strong> | Draw Time: {drawTime}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-black text-slate-400">Winner Revealed At Event End</h2>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          Prize: <strong className="text-blue-900">{activePrize?.name || `Rank ${selectedRank}`}</strong> | Draw Time: <span className="text-slate-600">Locked until {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {isAfterEnd && (
                  <div className="text-blue-600 hidden md:block">
                    <PartyPopper size={44} className="rotate-[-15deg]" />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 5 Prize Showcase Cards */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-4">
              <div className="h-0.5 w-16 bg-blue-900"></div>
              <span className="bg-blue-900 text-white font-black text-xs px-5 py-1.5 rounded-lg tracking-widest uppercase">PRIZES (RANKS 1 TO 5)</span>
              <div className="h-0.5 w-16 bg-blue-900"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {prizes.map((prize) => {
                const rankWinner = isAfterEnd ? activeWinners.find(w => w.rank === prize.rank) : null;

                return (
                  <div 
                    key={prize.rank}
                    className={`rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                      selectedRank === prize.rank ? 'ring-4 ring-blue-500/40 scale-105 border-blue-600 shadow-lg' : 'border-slate-200 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedRank(prize.rank)}
                  >
                    <PrizeCard 
                      rank={prize.rank}
                      name={prize.name}
                      image={prize.image}
                    />
                    {isAfterEnd && rankWinner && (
                      <div className="bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2 py-1 flex items-center justify-center gap-1 border-t border-emerald-200 truncate">
                        <Award size={13} />
                        <span className="truncate">#{rankWinner.invoiceNo} {rankWinner.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
