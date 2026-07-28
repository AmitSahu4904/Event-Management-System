import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

export const PrizeManagementSection = ({
  prizes = [],
  onImageUpload,
  onPrizeNameChange
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
        <ImageIcon size={20} className="text-blue-600" />
        3. Rank-wise Prize Management (Ranks 1 to 5)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {prizes.map((prize) => (
          <div key={prize.rank} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2">
              <span className="px-1.5 py-0.5 bg-blue-900 text-white rounded-md text-[10px] font-black">Rank {prize.rank}</span>
              <span className="font-extrabold text-xs text-slate-800">Prize Details</span>
            </div>

            {/* Image Preview & Upload Overlay */}
            <div className="h-28 bg-white border border-slate-200 rounded-lg relative overflow-hidden flex items-center justify-center group">
              <img 
                src={prize.image} 
                alt={prize.name} 
                className="max-h-full max-w-full object-contain p-2"
              />
              <label className="absolute inset-0 bg-slate-950/70 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
                <Upload size={16} />
                <span>Change Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onImageUpload(prize.rank, e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Prize Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Prize Name</label>
              <input 
                type="text" 
                value={prize.name} 
                onChange={(e) => onPrizeNameChange(prize.rank, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                required
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
