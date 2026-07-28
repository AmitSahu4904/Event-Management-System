import React from 'react';
import { Trophy, Users, Shuffle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Card';

export const WinnerDrawSection = ({
  winners = [],
  currentDraftWinners = [],
  realParticipantCount,
  onDrawAllWinners,
  onRedrawRank,
  onPublishWinners,
  drawResultNotice
}) => {
  const hasDrafts = currentDraftWinners.length > 0;
  const isPublished = winners.length > 0 && winners[0].published;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
        <Trophy size={20} className="text-amber-500" />
        2. Sequential 5-Winner Draw Engine
      </h2>

      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl w-fit">
        <Users size={18} className="text-blue-600" />
        <span>Total Registered Participants: <strong className="text-blue-900">{realParticipantCount}</strong></span>
      </div>

      {drawResultNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs font-bold">
          {drawResultNotice}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="success" 
          size="lg"
          icon={Shuffle}
          onClick={onDrawAllWinners}
          disabled={realParticipantCount === 0}
        >
          Draw All 5 Winners (Ranks 1 to 5)
        </Button>

        {hasDrafts && !isPublished && (
          <Button 
            variant="primary" 
            size="lg"
            icon={CheckCircle}
            onClick={onPublishWinners}
          >
            Publish Winners Permanently
          </Button>
        )}
      </div>

      {/* Draft Winners Preview before publishing */}
      {hasDrafts && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">DRAFT WINNERS SELECTION (Sequential 1 to 5)</span>
            <Badge variant={isPublished ? "success" : "warning"}>
              {isPublished ? "PUBLISHED" : "UNPUBLISHED DRAFT"}
            </Badge>
          </div>

          <div className="space-y-2">
            {currentDraftWinners.map((w) => (
              <div key={w.rank} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-900 text-white rounded-md text-[10px] font-black">Rank {w.rank}</span>
                  <span className="font-black text-blue-600">#{w.invoiceNo}</span>
                  <span className="text-slate-800 font-bold">{w.name}</span>
                  <span className="text-slate-500 font-semibold">({w.phone})</span>
                </div>

                {!isPublished && (
                  <button 
                    type="button" 
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                    onClick={() => onRedrawRank(w.rank)}
                    title={`Redraw Rank ${w.rank} only`}
                  >
                    <RefreshCw size={12} /> Redraw
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permanently Stored Winners */}
      {winners.length > 0 && isPublished && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider">🏆 Published Winners Roster</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {winners.map(w => (
              <div key={w.rank} className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex flex-col text-xs">
                <span className="font-black text-emerald-800 text-[10px]">Rank {w.rank}</span>
                <span className="font-black text-blue-600">#{w.invoiceNo}</span>
                <span className="font-bold text-slate-800 truncate">{w.name}</span>
                <span className="text-[10px] font-semibold text-slate-500 truncate">{w.prizeName || `Prize ${w.rank}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
