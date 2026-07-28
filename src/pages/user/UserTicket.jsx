import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const UserTicket = ({ ticket, eventName }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white border-2 border-blue-900 rounded-3xl overflow-hidden shadow-xl relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles size={22} className="text-amber-400 logo-sparkle" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase">Official Event Ticket</h2>
              <span className="text-[10px] font-bold text-blue-200">{eventName || 'DIVINE EMPIRE INDIA'}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-black tracking-wider shadow-xs">
            <CheckCircle2 size={14} /> CONFIRMED
          </span>
        </div>
        
        {/* Ticket Body */}
        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center space-y-1">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">LUCKY INVOICE NO.</span>
            <span className="text-6xl font-black text-blue-900 tracking-tight block">#{ticket.invoiceNo}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Participant Name</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">{ticket.name}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">{ticket.phone}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Event Name</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">{eventName}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Issued On</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">{formatDateTime(ticket.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center text-xs font-bold text-slate-600">
          Keep this ticket ready for the Live Draw announcement!
        </div>
      </div>
    </div>
  );
};
