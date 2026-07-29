import React, { useState, useEffect } from 'react';
import { useEvent } from '../../../context/EventContext';
import { 
  Calendar, 
  Check, 
  Clock, 
  Radio, 
  Info, 
  Link as LinkIcon, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  Gift, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Users, 
  ExternalLink,
  ArrowLeft,
  Hash
} from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { toast } from 'sonner';
import { DEFAULT_PRIZE_IMAGES } from '../../../data/dummyData';
import { parseEventDate } from '../../../utils/formatters';

export const EventManagementPage = () => {
  const { 
    eventsList, 
    activeEventId, 
    setActiveEvent, 
    createEvent, 
    updateEventDetails, 
    deleteEvent,
    prizes, 
    updatePrizeRank,
    registrations
  } = useEvent();

  // Mode: 'list' (shows events table) or 'form' (shows create/edit form)
  const [viewMode, setViewMode] = useState('list');
  const [editingEventId, setEditingEventId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [invoiceMin, setInvoiceMin] = useState(0);
  const [invoiceMax, setInvoiceMax] = useState(999);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [localPrizes, setLocalPrizes] = useState([]);

  // Invite link copied state
  const [copiedId, setCopiedId] = useState(null);

  // Initialize Form for Create or Edit
  const openCreateForm = () => {
    setEditingEventId(null);
    setName('');
    setDescription('');
    setInvoiceMin(0);
    setInvoiceMax(999);
    const futureStart = new Date(Date.now() + 15 * 60000);
    const localStart = new Date(futureStart.getTime() - futureStart.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const futureEnd = new Date(Date.now() + 86400000 + 15 * 60000);
    const localEnd = new Date(futureEnd.getTime() - futureEnd.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setStartDate(localStart);
    setEndDate(localEnd);
    setLocalPrizes([
      { rank: 1, name: 'WASHING MACHINE', image: DEFAULT_PRIZE_IMAGES.washingMachine },
      { rank: 2, name: 'MIXTURE GRINDER', image: DEFAULT_PRIZE_IMAGES.mixerGrinder },
      { rank: 3, name: 'MICRO OVEN', image: DEFAULT_PRIZE_IMAGES.microOven },
      { rank: 4, name: 'INDUCTION', image: DEFAULT_PRIZE_IMAGES.induction },
      { rank: 5, name: 'SANDWICH MAKER', image: DEFAULT_PRIZE_IMAGES.sandwichMaker }
    ]);
    setViewMode('form');
  };

  const openEditForm = (evt) => {
    // Select active first
    setActiveEvent(evt.id);
    setEditingEventId(evt.id);
    setName(evt.name || '');
    setDescription(evt.description || '');
    setInvoiceMin(evt.invoiceMin !== undefined ? evt.invoiceMin : 0);
    setInvoiceMax(evt.invoiceMax !== undefined ? evt.invoiceMax : 999);
    setStartDate(evt.startDate || '');
    setEndDate(evt.endDate || '');
    setLocalPrizes(prizes || []);
    setViewMode('form');
  };

  const handleSaveForm = (e) => {
    e.preventDefault();

    const minNum = Number(invoiceMin);
    const maxNum = Number(invoiceMax);

    if (isNaN(minNum) || isNaN(maxNum) || minNum < 0 || maxNum > 999 || minNum >= maxNum) {
      toast.error('Please enter a valid invoice range (Min must be less than Max, between 0 and 999)');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'lucky-draw-event';

    if (editingEventId) {
      updateEventDetails({
        name,
        description,
        sponsor: 'Divine Empire Global',
        invoiceMin: minNum,
        invoiceMax: maxNum,
        startDate,
        endDate,
        eventSlug: slug
      });
      toast.success(`Event "${name}" updated successfully!`);
    } else {
      const created = createEvent({
        name,
        description,
        sponsor: 'Divine Empire Global',
        invoiceMin: minNum,
        invoiceMax: maxNum,
        startDate,
        endDate,
        prizes: localPrizes
      });
      toast.success(`New Event "${created.name}" created and set as Active!`);
    }
    setViewMode('list');
  };

  const handleCopyInviteLink = (evt) => {
    const slug = evt.slug || evt.eventSlug || evt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const token = evt.inviteToken || 'botivate-live-token-2026';
    const inviteUrl = `${window.location.origin}/join?event=${slug}&token=${token}`;

    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(evt.id);
    toast.success(`Invite link for "${evt.name}" copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrizeNameChange = (rank, newName) => {
    const updated = localPrizes.map(p => p.rank === rank ? { ...p, name: newName } : p);
    setLocalPrizes(updated);
    if (editingEventId) {
      updatePrizeRank(rank, newName, localPrizes.find(p => p.rank === rank)?.image);
    }
  };

  const handleImageUpload = (rank, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const currentPrize = localPrizes.find(p => p.rank === rank);
      const updated = localPrizes.map(p => p.rank === rank ? { ...p, image: base64Image } : p);
      setLocalPrizes(updated);
      if (editingEventId) {
        updatePrizeRank(rank, currentPrize?.name || `Rank ${rank} Prize`, base64Image);
      }
      toast.success(`Rank ${rank} prize image updated!`);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id, evtName) => {
    if (window.confirm(`Are you sure you want to delete event "${evtName}"? This will also remove its registered participants and draw results.`)) {
      deleteEvent(id);
      toast.success(`Event "${evtName}" deleted.`);
    }
  };

  // Tab filter: 'LIVE' or 'ENDED'
  const [eventTab, setEventTab] = useState('LIVE');

  // Helper to determine exact real-time event status
  const getCalculatedStatus = (evt) => {
    if (!evt) return 'UPCOMING';
    const nowTime = new Date();
    const start = evt.startDate ? parseEventDate(evt.startDate) : new Date(Date.now() - 3600000);
    const end = evt.endDate ? parseEventDate(evt.endDate) : new Date(Date.now() + 86400000);

    if (nowTime < start) return 'UPCOMING';
    if (nowTime > end) return 'ENDED';
    return 'LIVE';
  };

  const liveEvents = eventsList.filter(e => {
    const status = getCalculatedStatus(e);
    return status === 'LIVE' || status === 'UPCOMING';
  });

  const endedEvents = eventsList.filter(e => {
    const status = getCalculatedStatus(e);
    return status === 'ENDED';
  });

  const displayedEvents = eventTab === 'LIVE' ? liveEvents : endedEvents;

  return (
    <div className="space-y-6">
      {/* Page Title Header with Top Right + Create Event Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
            <Calendar size={26} className="text-blue-600" />
            Event Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Create and manage multiple events, select active event, configure rank prizes, and share invite links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'form' && (
            <button
              type="button"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
              onClick={() => setViewMode('list')}
            >
              <ArrowLeft size={16} /> Back to Events List
            </button>
          )}

          <button
            type="button"
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            onClick={openCreateForm}
          >
            <Plus size={18} className="text-amber-400" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: TABULAR EVENTS LIST */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Live vs Ended Filter Tabs */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                eventTab === 'LIVE' 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setEventTab('LIVE')}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Events ({liveEvents.length})</span>
            </button>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                eventTab === 'ENDED' 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setEventTab('ENDED')}
            >
              <Clock size={14} className={eventTab === 'ENDED' ? 'text-amber-400' : 'text-slate-400'} />
              <span>Ended Events ({endedEvents.length})</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-black text-blue-900 uppercase tracking-wider">
                {eventTab === 'LIVE' ? 'Active Live & Upcoming Events' : 'Completed Ended Events'} ({displayedEvents.length})
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                Click <strong>Select Active</strong> to set event scope for participants & draw engine.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Active</th>
                    <th className="py-3 px-4">Event Name & Description</th>
                    <th className="py-3 px-4">Sponsor / Venue</th>
                    <th className="py-3 px-4">Dates & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {displayedEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar size={28} />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-blue-900">No {eventTab === 'LIVE' ? 'Live' : 'Ended'} Events Found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                              {eventTab === 'LIVE' 
                                ? 'There are currently no active or upcoming live events.' 
                                : 'There are currently no completed or past ended events.'}
                            </p>
                          </div>
                          {eventTab === 'LIVE' && (
                            <button
                              type="button"
                              className="mt-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                              onClick={openCreateForm}
                            >
                              <Plus size={18} className="text-amber-400" />
                              <span>Create Event</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedEvents.map((evt) => {
                      const isActive = evt.id === activeEventId;

                      return (
                        <tr 
                          key={evt.id} 
                          className={`transition-colors ${isActive ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                                <CheckCircle2 size={12} /> Active
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="px-2.5 py-1 bg-slate-200 hover:bg-blue-900 hover:text-white text-slate-700 rounded-full text-[10px] font-extrabold transition-all cursor-pointer"
                                onClick={() => setActiveEvent(evt.id)}
                              >
                                Select Active
                              </button>
                            )}
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-extrabold text-blue-900 text-sm truncate">{evt.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{evt.description || 'No description'}</div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800">{evt.sponsor || 'No Sponsor'}</div>
                            <div className="text-[11px] text-slate-500">{evt.venue || 'Online Stream'}</div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800">{evt.startDate ? new Date(evt.startDate).toLocaleDateString() : 'N/A'}</div>
                            <div className="text-[11px] text-slate-500">
                              {evt.startDate ? new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              {' - '}
                              {evt.endDate ? new Date(evt.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {(() => {
                              const realStatus = getCalculatedStatus(evt);
                              if (realStatus === 'UPCOMING') {
                                return (
                                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                                    <Clock size={12} /> UPCOMING
                                  </span>
                                );
                              }
                              if (realStatus === 'LIVE') {
                                return (
                                  <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE
                                  </span>
                                );
                              }
                              return (
                                <span className="inline-flex items-center gap-1.5 bg-slate-700 text-slate-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                                  ENDED
                                </span>
                              );
                            })()}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                title="Edit Setup & Prizes"
                                className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                onClick={() => openEditForm(evt)}
                              >
                                <Edit size={15} />
                              </button>

                              <button
                                type="button"
                                title="Copy Shareable Invite Link"
                                className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                                onClick={() => handleCopyInviteLink(evt)}
                              >
                                {copiedId === evt.id ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Share2 size={15} />}
                              </button>

                              <button
                                type="button"
                                title="Delete Event"
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                onClick={() => handleDelete(evt.id, evt.name)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: EVENT CREATE / EDIT FORM */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              {editingEventId ? `Edit Setup: ${name}` : 'Create New Event'}
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {editingEventId ? `Event ID: ${editingEventId}` : 'New Event Setup'}
            </span>
          </div>

          {/* Shareable Participant Invite Link Card (If Editing) */}
          {editingEventId && (
            <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-amber-400/30">
                  <Sparkles size={12} /> Participant Registration Link
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {window.location.origin}/join?event={name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/15">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/join?event=${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}&token=tok_live_2026`}
                  className="bg-transparent text-white font-mono text-xs font-semibold px-2 w-full outline-none select-all"
                />
                <button
                  type="button"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/join?event=${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}&token=tok_live_2026`);
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Section 1: General Details */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Info size={16} className="text-blue-600" /> 1. General Information
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divine Empire India"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                required
              />
            </div>

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
          </div>

          {/* Section 2: Invoice Number Range Configuration */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Hash size={16} className="text-blue-600" /> 2. Invoice Number Range Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Min Invoice Number</label>
                <input
                  type="number"
                  min="0"
                  max="998"
                  value={invoiceMin}
                  onChange={(e) => setInvoiceMin(e.target.value)}
                  placeholder="e.g. 0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Invoice Number</label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={invoiceMax}
                  onChange={(e) => setInvoiceMax(e.target.value)}
                  placeholder="e.g. 999"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Participants will be able to select invoice numbers between <strong className="text-blue-900">#{String(invoiceMin).padStart(3, '0')}</strong> and <strong className="text-blue-900">#{String(invoiceMax).padStart(3, '0')}</strong>.
            </p>
          </div>

          {/* Section 3: Schedule */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-blue-600" /> 3. Schedule & Live Time Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Date & Time</label>
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

          {/* Section 4: Rank Prizes */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Gift size={16} className="text-blue-600" /> 4. Rank-wise Prize Configuration (Ranks 1 to 5)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-2">
              {localPrizes.map((prize) => (
                <div key={prize.rank} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2">
                    <span className="px-2 py-0.5 bg-blue-900 text-white rounded-md text-[10px] font-black">Rank {prize.rank}</span>
                  </div>

                  <div className="h-28 bg-white border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center group shadow-xs">
                    {prize.image ? (
                      <img 
                        src={prize.image} 
                        alt={prize.name} 
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <Gift size={28} className="text-blue-500" />
                        <span className="text-[10px] font-bold">No Image</span>
                      </div>
                    )}

                    <label className="absolute inset-0 bg-slate-950/75 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold backdrop-blur-xs">
                      <Upload size={18} />
                      <span>Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(prize.rank, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Prize Name</label>
                    <input 
                      type="text" 
                      value={prize.name} 
                      onChange={(e) => handlePrizeNameChange(prize.rank, e.target.value)}
                      placeholder={`e.g. Rank ${prize.rank} Prize`}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              onClick={() => setViewMode('list')}
            >
              Cancel
            </button>

            <Button type="submit" variant="primary" icon={Check}>
              {editingEventId ? 'Save Configuration Changes' : 'Create Event & Set Active'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
