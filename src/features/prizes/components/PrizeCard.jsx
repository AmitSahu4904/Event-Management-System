import React from 'react';
import { Gift, Trophy, WashingMachine, Tv, Sparkles, Package } from 'lucide-react';

const RANK_COLORS = {
  1: { badge: 'bg-blue-600 text-white', bar: 'bg-blue-900 text-white', icon: 'text-blue-600' },
  2: { badge: 'bg-emerald-600 text-white', bar: 'bg-emerald-800 text-white', icon: 'text-emerald-600' },
  3: { badge: 'bg-amber-500 text-white', bar: 'bg-amber-700 text-white', icon: 'text-amber-600' },
  4: { badge: 'bg-red-600 text-white', bar: 'bg-red-800 text-white', icon: 'text-red-600' },
  5: { badge: 'bg-purple-600 text-white', bar: 'bg-purple-900 text-white', icon: 'text-purple-600' }
};

export const PrizeCard = ({ rank, name, prizeName, image, imageUrl, winnerName }) => {
  const finalName = name || prizeName || `Rank ${rank} Prize`;
  const finalImg = image || imageUrl;
  const colorScheme = RANK_COLORS[rank] || RANK_COLORS[1];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col relative overflow-hidden shadow-xs hover:shadow-md transition-all">
      {/* Rank Badge */}
      <div className={`absolute top-0 left-0 w-8 h-8 font-black text-xs flex items-center justify-center rounded-br-xl z-10 shadow-xs ${colorScheme.badge}`}>
        {rank}
      </div>

      {/* Image Container / SVG Fallback */}
      <div className="h-36 p-4 flex items-center justify-center bg-slate-50 relative">
        {finalImg ? (
          <img 
            src={finalImg} 
            alt={finalName} 
            className="max-h-full max-w-full object-contain" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Gift size={36} className={colorScheme.icon} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prize Rank {rank}</span>
          </div>
        )}
      </div>

      {/* Prize Title Footer */}
      <div className={`py-2.5 px-3 text-center font-extrabold text-xs tracking-wider uppercase truncate ${colorScheme.bar}`}>
        {finalName}
      </div>

      {/* Winner Tag if Won */}
      {winnerName && (
        <div className="p-1.5 bg-amber-50 text-amber-900 text-center text-[10px] font-black border-t border-amber-200 flex items-center justify-center gap-1">
          <Trophy size={12} className="text-amber-500" /> {winnerName}
        </div>
      )}
    </div>
  );
};
