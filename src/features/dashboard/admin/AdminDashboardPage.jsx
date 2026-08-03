import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/context/EventContext';
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
import { ROUTES } from '@/shared/constants/routes';
import { formatDateTime, getEventRealtimeStatus } from '@/shared/utils/formatters';
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

  const minVal = eventData?.invoiceMin !== undefined ? Number(eventData.invoiceMin) : 0;
  const maxVal = eventData?.invoiceMax !== undefined ? Number(eventData.invoiceMax) : 999;
  const totalPossible = Math.max(1, maxVal - minVal + 1);

  const reservedCount = registrations.length;
  const remainingCount = Math.max(0, totalPossible - reservedCount);
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
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
            <Layers size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">CURRENTLY MANAGING</span>
            <h2 className="text-base sm:text-lg font-black text-white truncate">{eventData?.name || 'Default Lucky Draw'}</h2>
            <p className="text-xs text-slate-300 font-medium truncate">
              Sponsor: {eventData?.sponsor || 'Divine Empire Global'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 self-stretch sm:self-auto justify-center"
          onClick={() => navigate(ROUTES.EVENT)}
        >
          <Calendar size={15} /> Switch / Create Event
        </button>
      </div>

      {/* 2. DASHBOARD TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-900">System Overview Dashboard</h1>
        </div>
      </div>

      {/* 3. KPI CARDS GRID (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black text-slate-900 leading-none block truncate">{reservedCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block truncate">Participants</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Ticket size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black text-slate-900 leading-none block truncate">{remainingCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block truncate">Remaining</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Gift size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-black text-slate-900 leading-none block truncate">{prizesCount} Ranks</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block truncate">Prizes</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            currentRealtimeStatus === 'UPCOMING'
              ? 'bg-amber-50 text-amber-600'
              : currentRealtimeStatus === 'LIVE'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {currentRealtimeStatus === 'UPCOMING' ? (
              <Clock size={20} />
            ) : (
              <BarChart2 size={20} />
            )}
          </div>
          <div className="min-w-0">
            <span className={`text-base sm:text-lg font-black leading-none block truncate ${
              currentRealtimeStatus === 'UPCOMING'
                ? 'text-amber-600'
                : currentRealtimeStatus === 'LIVE'
                ? 'text-emerald-600'
                : 'text-slate-700'
            }`}>
              {currentRealtimeStatus}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 block truncate">Status</span>
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
          <h3 className="text-base font-bold text-blue-900 mb-4">
            Invoice Grid Occupancy ({String(minVal).padStart(3, '0')} - {String(maxVal).padStart(3, '0')})
          </h3>
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
    </div>
  );
};
