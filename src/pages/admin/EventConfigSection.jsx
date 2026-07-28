import React from 'react';
import { Calendar, Check, Clock, Radio, Info } from 'lucide-react';
import { Button } from '../../shared/components/Button';

export const EventConfigSection = ({
  eventName,
  setEventName,
  description = '',
  setDescription,
  sponsor = '',
  setSponsor,
  venue = '',
  setVenue,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isLive,
  setIsLive,
  onSubmit,
  saveNotice,
  activeTab = 'LIVE',
  onTabChange
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {onTabChange && (
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'LIVE' 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => onTabChange('LIVE')}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Events</span>
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ENDED' 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => onTabChange('ENDED')}
          >
            <Clock size={14} className={activeTab === 'ENDED' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Ended Events</span>
          </button>
        </div>
      )}

      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
        <Calendar size={20} className="text-blue-600" />
        1. Event Details & Timing Configuration
      </h2>

      {saveNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold shadow-xs">
          {saveNotice}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* General Details */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Info size={14} className="text-blue-600" /> General Information
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Name</label>
            <input 
              type="text" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. DIVINE EMPIRE INDIA"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
              required
            />
          </div>

          {setDescription && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Description</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the grand prize draw event..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white resize-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setSponsor && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sponsor Name</label>
                <input 
                  type="text" 
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="e.g. Divine Empire Global"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                />
              </div>
            )}

            {setVenue && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue / Location</label>
                <input 
                  type="text" 
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Live Online Stream"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-blue-600" /> Timing & Live Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Date & Time (Live Time)</label>
              <input 
                type="datetime-local" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Date & Time</label>
              <input 
                type="datetime-local" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Live Broadcast Toggle */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="w-5 h-5 accent-blue-900 rounded-md cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-800">
              Set Event Status to <strong className="text-red-600 uppercase">LIVE Broadcast</strong>
            </span>
          </label>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" icon={Check}>
            Save Event Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
