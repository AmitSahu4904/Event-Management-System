import React from 'react';
import { Sparkles, CheckCircle2, Ticket, Calendar, Phone, User, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/formatters';

export const UserTicket = ({ ticket, eventName }) => {
  if (!ticket) return null;

  return (
    <div className="w-full max-w-xl mx-auto my-2">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg relative">
        {/* Card Top Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">OFFICIAL EVENT TICKET</span>
              <h3 className="text-base sm:text-lg font-black text-white truncate">{eventName || 'Divine Empire Global'}</h3>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-black flex items-center gap-1.5 flex-shrink-0">
            <CheckCircle2 size={14} /> Registered
          </div>
        </div>

        {/* Card Core Content */}
        <div className="p-6 space-y-5 bg-slate-50/50">
          {/* Invoice Number Spotlight Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-indigo-50/60 border-2 border-dashed border-blue-300 rounded-2xl text-center">
            <span className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Ticket size={16} className="text-blue-600" /> Reserved Invoice Number
            </span>
            <div className="text-5xl sm:text-6xl font-black text-blue-900 font-mono tracking-tight my-1 drop-shadow-xs">
              #{ticket.invoiceNo}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200/80 mt-1">
              <ShieldCheck size={12} /> Locked & Valid for Live Draw
            </span>
          </div>

          {/* Participant Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Participant Name</span>
                <span className="font-black text-slate-900 text-sm truncate block">{ticket.name}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                <Phone size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone Number</span>
                <span className="font-black text-slate-900 text-sm font-mono block">{ticket.phone}</span>
              </div>
            </div>
          </div>

          {ticket.timestamp && (
            <div className="text-center text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <span>Registered on {formatDateTime(ticket.timestamp)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
