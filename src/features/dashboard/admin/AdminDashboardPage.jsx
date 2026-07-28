import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../../context/EventContext';
import { 
  Users, 
  Ticket, 
  Trophy, 
  Gift, 
  BarChart2, 
  Calendar, 
  Layers, 
  Search, 
  UserPlus, 
  Trash2, 
  X, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { ROUTES } from '../../../shared/constants/routes';
import { formatDateTime, getEventRealtimeStatus } from '../../../utils/formatters';
import { toast } from 'sonner';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { 
    eventData, 
    registrations, 
    winners, 
    prizes, 
    registerUser,
    removeRegistration,
    isInvoiceTaken
  } = useEvent();

  // Realtime Status Ticker
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentRealtimeStatus = getEventRealtimeStatus(eventData, now);

  // Participant Management Local States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'WINNER' | 'REGISTERED'

  // Modal State for Manual Participant Registration
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addInvoiceNo, setAddInvoiceNo] = useState('');

  const reservedCount = registrations.length;
  const remainingCount = 1000 - reservedCount;
  const prizesCount = prizes.length;

  // Set of winning invoice numbers and winning participant IDs
  const winningInvoices = new Set(winners.map(w => w.invoiceNo));
  const winningParticipantIds = new Set(
    winners.flatMap(w => w.participantIds || (w.participantId ? [w.participantId] : []))
  );

  // Filtered Participants List
  const filteredParticipants = registrations.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm) ||
                          p.invoiceNo.includes(searchTerm);
    const isWinner = winningInvoices.has(p.invoiceNo) || winningParticipantIds.has(p.id);

    if (statusFilter === 'WINNER') return matchesSearch && isWinner;
    return matchesSearch;
  });

  const hourlyData = [
    { time: '09:00', count: Math.max(1, Math.floor(reservedCount * 0.1)) },
    { time: '10:00', count: Math.max(2, Math.floor(reservedCount * 0.25)) },
    { time: '11:00', count: Math.max(4, Math.floor(reservedCount * 0.5)) },
    { time: '12:00', count: Math.max(6, Math.floor(reservedCount * 0.75)) },
    { time: '13:00', count: Math.max(8, Math.floor(reservedCount * 0.9)) },
    { time: '14:00', count: reservedCount }
  ];

  const pieData = [
    { name: 'Reserved Invoices', value: reservedCount, color: '#2563eb' },
    { name: 'Available Invoices', value: remainingCount, color: '#e2e8f0' }
  ];

  // Add Participant Handler
  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!addName.trim() || !addPhone.trim() || !addInvoiceNo.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const formattedInvoice = String(addInvoiceNo.trim()).padStart(3, '0');
    if (isInvoiceTaken(formattedInvoice)) {
      toast.error(`Invoice #${formattedInvoice} is already reserved!`);
      return;
    }

    const res = registerUser(addName.trim(), addPhone.trim(), formattedInvoice);
    if (res.success) {
      toast.success(`Participant "${addName.trim()}" added with Invoice #${formattedInvoice}`);
      setShowAddModal(false);
      setAddName('');
      setAddPhone('');
      setAddInvoiceNo('');
    } else {
      toast.error(res.message);
    }
  };

  // Delete Participant Handler
  const handleDeleteParticipant = (invoiceNo, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" (Invoice #${invoiceNo})?`)) {
      removeRegistration(invoiceNo);
      toast.success(`Participant "${name}" removed`);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. ACTIVE EVENT CONTEXT BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">CURRENTLY MANAGING</span>
            <h2 className="text-lg font-black text-white">{eventData?.name || 'Default Lucky Draw'}</h2>
            <p className="text-xs text-slate-300 font-medium">
              Sponsor: {eventData?.sponsor || 'Divine Empire Global'} | Venue: {eventData?.venue || 'Online Stream'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
          onClick={() => navigate(ROUTES.EVENT)}
        >
          <Calendar size={15} /> Switch / Create Event
        </button>
      </div>

      {/* 2. DASHBOARD TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-900">System Overview Dashboard</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Real-time stats for event participation, invoice grid occupancy, and automated 5-rank winner draws.
          </p>
        </div>
      </div>

      {/* 3. KPI CARDS GRID (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 leading-none block">{reservedCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Participants</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Ticket size={22} />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 leading-none block">{remainingCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Remaining</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Gift size={22} />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 leading-none block">{prizesCount} Ranks</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Prizes</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            currentRealtimeStatus === 'UPCOMING'
              ? 'bg-amber-50 text-amber-600'
              : currentRealtimeStatus === 'LIVE'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {currentRealtimeStatus === 'UPCOMING' ? (
              <Clock size={22} />
            ) : (
              <BarChart2 size={22} />
            )}
          </div>
          <div>
            <span className={`text-lg font-black leading-none block ${
              currentRealtimeStatus === 'UPCOMING'
                ? 'text-amber-600'
                : currentRealtimeStatus === 'LIVE'
                ? 'text-emerald-600'
                : 'text-slate-700'
            }`}>
              {currentRealtimeStatus}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block">Status</span>
          </div>
        </div>
      </div>

      {/* 4. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-blue-900 mb-4">Hourly Registration Velocity</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-blue-900 mb-4">Invoice Grid Occupancy (000 - 999)</h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={4} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. PARTICIPANT MANAGEMENT */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
              <Users size={22} className="text-blue-600" /> Participant Roster & Management
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Search, filter, view, add, and manage all 000–999 registered participants.
            </p>
          </div>

          <button 
            type="button" 
            className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 self-start sm:self-auto"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={16} /> Add Participant
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl w-full sm:w-80 border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search name, phone, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-xs font-medium w-full text-slate-800"
            />
          </div>

          <div className="flex gap-2">
            <button className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'ALL' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setStatusFilter('ALL')}>All Participants ({registrations.length})</button>
            <button className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'WINNER' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setStatusFilter('WINNER')}>Winners ({winners.length})</button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 font-extrabold text-slate-700 uppercase">
              <tr>
                <th className="px-4 py-3">Invoice No.</th>
                <th className="px-4 py-3">Participant Name</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Registration Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-semibold">
                    No matching participants found.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map(p => {
                  const isWinner = winningInvoices.has(p.invoiceNo) || winningParticipantIds.has(p.id);
                  return (
                    <tr key={p.id || p.invoiceNo} className={isWinner ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-black text-blue-900">#{p.invoiceNo}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">{p.phone}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDateTime(p.timestamp)}</td>
                      <td className="px-4 py-3">
                        {isWinner ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">WINNER</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-700 border border-sky-200">Reserved</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          type="button" 
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                          onClick={() => handleDeleteParticipant(p.invoiceNo, p.name)}
                          title="Remove Participant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual Add Participant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
                <UserPlus size={20} className="text-blue-600" /> Add New Participant
              </h3>
              <button 
                type="button" 
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                onClick={() => setShowAddModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Singh"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Invoice Number (000–999)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 789"
                  maxLength={3}
                  value={addInvoiceNo}
                  onChange={(e) => setAddInvoiceNo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 cursor-pointer"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={16} /> Save & Register Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
