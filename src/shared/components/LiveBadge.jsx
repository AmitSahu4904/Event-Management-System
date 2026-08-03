import React from 'react';
import { Users } from 'lucide-react';

export const LiveBadge = ({ isLive = true, participantCount = 356 }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-xs ${
        isLive ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-ping' : 'bg-slate-500'}`}></span>
        <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
        <Users size={16} className="text-blue-600" />
        <div className="flex flex-col leading-tight">
          <span className="font-black text-xs text-blue-900">{participantCount}</span>
          <span className="text-[10px] font-semibold text-slate-500">Live Viewers</span>
        </div>
      </div>
    </div>
  );
};
