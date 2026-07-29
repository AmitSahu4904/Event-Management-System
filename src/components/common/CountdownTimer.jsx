import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { parseEventDate } from '../../utils/formatters';

export const CountdownTimer = ({ targetDate, startDate, size = 'small' }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, status: 'LIVE' });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const start = startDate ? parseEventDate(startDate).getTime() : now;
      const end = targetDate ? parseEventDate(targetDate).getTime() : now + 3600000;

      if (now < start) {
        const diff = start - now;
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: 'COUNTDOWN'
        });
      } else if (now >= start && now <= end) {
        const diff = end - now;
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: 'LIVE'
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, status: 'ENDED' });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate, targetDate]);

  if (size === 'large') {
    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-6 py-2 sm:py-4 max-w-full">
        <div className="flex flex-col items-center">
          <div className="w-13 h-13 sm:w-24 sm:h-24 bg-gradient-to-b from-blue-900 to-slate-950 border-2 border-blue-500/40 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-blue-950/50 relative overflow-hidden">
            <span className="font-mono text-2xl sm:text-5xl font-black text-amber-400 tracking-tighter drop-shadow-md">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[9px] sm:text-xs font-black uppercase text-blue-200 mt-1.5 sm:mt-2 tracking-widest">Hours</span>
        </div>

        <span className="text-xl sm:text-4xl font-black text-blue-400 animate-pulse pb-5 sm:pb-6">:</span>

        <div className="flex flex-col items-center">
          <div className="w-13 h-13 sm:w-24 sm:h-24 bg-gradient-to-b from-blue-900 to-slate-950 border-2 border-blue-500/40 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-blue-950/50 relative overflow-hidden">
            <span className="font-mono text-2xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[9px] sm:text-xs font-black uppercase text-blue-200 mt-1.5 sm:mt-2 tracking-widest">Minutes</span>
        </div>

        <span className="text-xl sm:text-4xl font-black text-blue-400 animate-pulse pb-5 sm:pb-6">:</span>

        <div className="flex flex-col items-center">
          <div className="w-13 h-13 sm:w-24 sm:h-24 bg-gradient-to-b from-blue-900 to-slate-950 border-2 border-amber-400/60 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-amber-400/20 relative overflow-hidden ring-2 sm:ring-4 ring-amber-400/20">
            <span className="font-mono text-2xl sm:text-5xl font-black text-amber-400 tracking-tighter drop-shadow-md animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[9px] sm:text-xs font-black uppercase text-amber-300 mt-1.5 sm:mt-2 tracking-widest">Seconds</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl font-bold text-xs text-blue-900 shadow-xs">
      <Clock size={16} className="text-blue-600" />
      <span>
        {timeLeft.status === 'COUNTDOWN' ? 'Starts In:' : timeLeft.status === 'LIVE' ? 'Ends In:' : 'Event Active'}
      </span>
      {timeLeft.status !== 'ENDED' ? (
        <span className="font-black font-mono text-xs bg-blue-900 text-white px-2 py-0.5 rounded-md">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      ) : (
        <span className="font-black text-xs text-emerald-600 uppercase">Live Now</span>
      )}
    </div>
  );
};
