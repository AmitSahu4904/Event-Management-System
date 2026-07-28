import React from 'react';
import { formatInvoiceNo } from '../../utils/formatters';

export const FlipClock = ({ number, value }) => {
  const displayVal = number || value || "987";
  const digits = formatInvoiceNo(displayVal).split('');

  return (
    <div className="flex flex-col items-center my-4">
      <div className="bg-blue-900 text-white font-black text-xs px-6 py-1 rounded-full tracking-widest -mb-3.5 z-10 shadow-md border border-blue-700">
        INVOICE NO.
      </div>
      <div className="flex gap-4 bg-blue-50/90 p-5 rounded-3xl border-2 border-blue-200 shadow-sm">
        {digits.map((digit, index) => (
          <div key={index} className="w-24 h-32 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 rounded-2xl relative flex items-center justify-center shadow-xl border border-blue-800/40">
            <div className="w-1.5 h-4.5 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 rounded-xs absolute top-1/2 -translate-y-1/2 -left-1 z-20 shadow-xs"></div>
            <div className="w-1.5 h-4.5 bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 rounded-xs absolute top-1/2 -translate-y-1/2 -right-1 z-20 shadow-xs"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/60 z-10"></div>
            <div className="text-7xl font-black text-white drop-shadow-lg tracking-tight select-none">
              {digit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
