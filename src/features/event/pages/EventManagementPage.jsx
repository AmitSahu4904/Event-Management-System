import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useEvent } from '@/context/EventContext';
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
  Hash,
  FileSpreadsheet,
  FileText,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { toast } from 'sonner';
import { DEFAULT_PRIZE_IMAGES } from '@/data/dummyData';
import { parseEventDate } from '@/shared/utils/formatters';
import { parseParticipantsExcel, downloadSampleExcel } from '@/features/participants/utils/excelImportUtils';
import { eventStorage as eventStorageService } from '@/features/event/services/eventStorage';

export const EventManagementPage = () => {
  const navigate = useNavigate();

  const { 
    eventsList, 
    activeEventId, 
    setActiveEvent, 
    createEvent, 
 updateEventDetails, 
    deleteEvent,
    prizes, 
    updatePrizeRank,
    registrations,
    winners,
    importBulkParticipants
  } = useEvent();

  // Excel Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTargetEventId, setImportTargetEventId] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importedPreview, setImportedPreview] = useState([]);

  const openParticipantsViewModal = (evt) => {
    if (evt && evt.id) {
      setActiveEvent(evt.id);
      navigate(`${ROUTES.PARTICIPANTS}?eventId=${evt.id}`);
    } else {
      navigate(ROUTES.PARTICIPANTS);
    }
  };

  const openImportModal = (evtId) => {
    const targetId = evtId || activeEventId;
    setActiveEvent(targetId);
    setImportTargetEventId(targetId);
    setImportedPreview([]);
    setShowImportModal(true);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await parseParticipantsExcel(file);
      setImportedPreview(result.participants);
      importBulkParticipants(result.participants);
      toast.success(`Appended ${result.totalCount} participant records from Excel to this event!`);
    } catch (err) {
      toast.error(err.message || 'Failed to parse Excel file.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  // Mode: 'list' (shows events table) or 'form' (shows create/edit form)
  const [viewMode, setViewMode] = useState('list');
  const [editingEventId, setEditingEventId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [liveStartDate, setLiveStartDate] = useState('');
  const [liveEndDate, setLiveEndDate] = useState('');
  const [localPrizes, setLocalPrizes] = useState([]);

  // Invite link copied state
  const [copiedId, setCopiedId] = useState(null);

  // Initialize Form for Create or Edit
  const openCreateForm = () => {
    setEditingEventId(null);
    setName('');
    setDescription('');

    const nowTime = new Date();
    const futureStart = new Date(nowTime.getTime() + 15 * 60000);
    const localStart = new Date(futureStart.getTime() - futureStart.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const futureEnd = new Date(nowTime.getTime() + 86400000 + 15 * 60000);
    const localEnd = new Date(futureEnd.getTime() - futureEnd.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const liveStart = new Date(nowTime.getTime() + 86400000);
    const localLiveStart = new Date(liveStart.getTime() - liveStart.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const liveEnd = new Date(nowTime.getTime() + 86400000 + 7200000);
    const localLiveEnd = new Date(liveEnd.getTime() - liveEnd.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setStartDate(localStart);
    setEndDate(localEnd);
    setLiveStartDate(localLiveStart);
    setLiveEndDate(localLiveEnd);

    setLocalPrizes([
      { rank: 1, name: '', image: '' }
    ]);
    setViewMode('form');
  };

  const openEditForm = (evt) => {
    setActiveEvent(evt.id);
    setEditingEventId(evt.id);
    setName(evt.name || '');
    setDescription(evt.description || '');
    setStartDate(evt.startDate || '');
    setEndDate(evt.endDate || '');
    setLiveStartDate(evt.liveStartDate || evt.startDate || '');
    setLiveEndDate(evt.liveEndDate || evt.endDate || '');
    
    const eventPrizes = eventStorageService.getPrizes(evt.id);
    setLocalPrizes(eventPrizes && eventPrizes.length > 0 ? eventPrizes : prizes);
    setViewMode('form');
  };

  const handleAddPrizeRank = () => {
    if (localPrizes.length >= 5) {
      toast.error('Maximum limit of 5 prize ranks reached.');
      return;
    }

    const nextRank = localPrizes.length + 1;
    setLocalPrizes([...localPrizes, { rank: nextRank, name: '', image: '' }]);
    toast.success(`Rank ${nextRank} prize slot added!`);
  };

  const handleRemovePrizeRank = (rankToRemove) => {
    if (localPrizes.length <= 1) {
      toast.error('Event must contain at least 1 prize rank.');
      return;
    }
    const filtered = localPrizes.filter(p => p.rank !== rankToRemove);
    const resequenced = filtered.map((p, idx) => ({ ...p, rank: idx + 1 }));
    setLocalPrizes(resequenced);
    toast.success(`Prize rank removed. Remaining prizes re-sequenced.`);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter an Event Name');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'lucky-draw-event';

    if (editingEventId) {
      updateEventDetails({
        name,
        description,
        sponsor: 'Divine Empire Global',
        startDate,
        endDate,
        liveStartDate,
        liveEndDate,
        eventSlug: slug,
        prizes: localPrizes
      });
      toast.success(`Event "${name}" updated successfully!`);
    } else {
      const created = createEvent({
        name,
        description,
        sponsor: 'Divine Empire Global',
        startDate,
        endDate,
        liveStartDate,
        liveEndDate,
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
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
            <Calendar size={26} className="text-blue-600" />
            Event Management
          </h1>
        </div>

        {viewMode === 'form' && (
          <button
            type="button"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
            onClick={() => setViewMode('list')}
          >
            <ArrowLeft size={16} /> Back to Events List
          </button>
        )}
      </div>

      {/* VIEW MODE 1: TABULAR EVENTS LIST */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Live vs Ended Filter Tabs + Right-aligned + Create Event Button */}
          <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
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

            <button
              type="button"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
              onClick={openCreateForm}
            >
              <Plus size={16} className="text-amber-400" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-sm font-black text-blue-900 uppercase tracking-wider">
                {eventTab === 'LIVE' ? 'Active Live & Upcoming Events' : 'Completed Ended Events'} ({displayedEvents.length})
              </h2>
              <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                Click <strong>Select Active</strong> to set event scope for participants & draw engine.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Active</th>
                    <th className="py-3 px-4">Event Name & Description</th>
                    <th className="py-3 px-4 hidden md:table-cell">Sponsor</th>
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

                          <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                            <div className="font-bold text-slate-800">{evt.sponsor || 'No Sponsor'}</div>
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
                                title="View Event Participants"
                                className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                                onClick={() => openParticipantsViewModal(evt)}
                              >
                                <Users size={14} />
                                <span>Participants</span>
                              </button>

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

          {/* Section 2: Registration & Live Time Windows */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-blue-600" /> 2. Registration & Live Duration Time Windows
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider block">Registration Window (Client Registration Period)</span>
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

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">Event Live Duration (Live Draw & Spinner Window)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-800">Live Duration Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={liveStartDate}
                      onChange={(e) => setLiveStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-100 transition-all bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-800">Live Duration End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={liveEndDate}
                      onChange={(e) => setLiveEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-100 transition-all bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Rank Prize Setup */}
          <div className="space-y-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                <Gift size={16} className="text-blue-600" /> 3. Rank-wise Prize Configuration
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Configure prizes for each sequential rank (Rank 1 to {localPrizes.length}, Max: 5 Ranks).
              </p>
            </div>

            {/* Horizontal Rows for Prize Ranks */}
            <div className="space-y-3 pt-2">
              {localPrizes.map((prize) => (
                <div key={prize.rank} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl shadow-xs transition-all hover:border-slate-300">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-black self-start sm:self-auto flex-shrink-0 shadow-2xs">
                      Rank {prize.rank}
                    </span>
                  </div>

                  {/* Empty Input for Prize Name */}
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={prize.name} 
                      onChange={(e) => handlePrizeNameChange(prize.rank, e.target.value)}
                      placeholder={`Enter Prize Name for Rank ${prize.rank} (e.g. Washing Machine, Laptop, Car)...`}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                      required
                    />
                  </div>

                  {/* Upload Picture Button & Preview Thumbnail */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <label className="px-3 py-2 bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
                      <Upload size={14} className="text-blue-600" />
                      <span>{prize.image ? 'Change Picture' : 'Upload Picture'}</span>
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

                    {prize.image ? (
                      <div className="w-9 h-9 border border-slate-300 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 flex-shrink-0 shadow-2xs">
                        <img src={prize.image} alt={`Rank ${prize.rank}`} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 border border-dashed border-slate-300 rounded-xl bg-slate-100/70 flex items-center justify-center text-slate-400 flex-shrink-0" title="No Picture Uploaded">
                        <Gift size={16} />
                      </div>
                    )}

                    {/* Delete button if > 1 rank */}
                    {localPrizes.length > 1 && (
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title={`Remove Rank ${prize.rank}`}
                        onClick={() => handleRemovePrizeRank(prize.rank)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Plus (+) Button at the end of line */}
              {localPrizes.length < 5 && (
                <div className="pt-1 flex items-center justify-start">
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                    onClick={handleAddPrizeRank}
                  >
                    <Plus size={16} className="text-amber-400" /> Add Next Prize ({localPrizes.length}/5)
                  </button>
                </div>
              )}
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

      {/* Excel Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
                <FileSpreadsheet size={22} className="text-emerald-600" /> Import Participants Excel File
              </h3>
              <button 
                type="button" 
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                onClick={() => setShowImportModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-600">
                Import client participants and invoice numbers from an Excel file (<code className="text-blue-900 font-bold">.xlsx</code>, <code className="text-blue-900 font-bold">.xls</code>, or <code className="text-blue-900 font-bold">.csv</code>).
              </p>

              {/* Upload Drop Area */}
              <label className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload size={32} className="text-emerald-600" />
                <span className="text-xs font-extrabold text-emerald-900">
                  {isImporting ? 'Processing Excel File...' : 'Click to Select or Drag & Drop Excel File'}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Supports .xlsx, .xls, .csv files</span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  className="hidden" 
                  disabled={isImporting}
                  onChange={handleExcelUpload}
                />
              </label>

              {/* Imported Table Preview */}
              {importedPreview.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      {importedPreview.length} Participant Records Loaded:
                    </span>
                    <button 
                      type="button" 
                      className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                      onClick={() => setShowImportModal(false)}
                    >
                      Done & Save
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-inner">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="px-3.5 py-2">Serial Number</th>
                          <th className="px-3.5 py-2">Customer Name</th>
                          <th className="px-3.5 py-2">Phone Number</th>
                          <th className="px-3.5 py-2">Invoice Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {importedPreview.map((p, idx) => (
                          <tr key={p.id || idx} className="hover:bg-slate-50">
                            <td className="px-3.5 py-2 font-bold text-slate-700">{p.sNo || (idx + 1)}</td>
                            <td className="px-3.5 py-2 font-bold text-slate-800">{p.name}</td>
                            <td className="px-3.5 py-2 font-mono text-slate-600">{p.phone}</td>
                            <td className="px-3.5 py-2 font-black text-blue-900 font-mono">#{p.invoiceNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Template Download Section */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-semibold">Need a sample template?</span>
                <button
                  type="button"
                  className="text-blue-900 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                  onClick={downloadSampleExcel}
                >
                  <FileText size={14} /> Download Sample Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
