import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/authStore';
import { useEvent } from '../../../context/EventContext';
import { ROUTES } from '../../../shared/constants/routes';
import { Hash, Search, Check, Ticket } from 'lucide-react';
import { toast } from 'sonner';

export const NumberPickerPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { registerUser, currentUserTicket } = useEvent();

  const [selectedNumber, setSelectedNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRange, setActiveRange] = useState('000-099');

  // Guards: Redirect if not logged in or if current user ALREADY has a ticket matching their phone
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(ROUTES.JOIN);
    } else if (currentUserTicket?.invoiceNo && currentUserTicket?.phone === user?.phone) {
      navigate(ROUTES.JOIN_LIVE);
    }
  }, [isAuthenticated, user, currentUserTicket, navigate]);

  const allNumbers = Array.from({ length: 1000 }, (_, i) => String(i).padStart(3, '0'));

  const ranges = [
    { label: '000-099', min: 0, max: 99 },
    { label: '100-199', min: 100, max: 199 },
    { label: '200-299', min: 200, max: 299 },
    { label: '300-399', min: 300, max: 399 },
    { label: '400-499', min: 400, max: 499 },
    { label: '500-599', min: 500, max: 599 },
    { label: '600-699', min: 600, max: 699 },
    { label: '700-799', min: 700, max: 799 },
    { label: '800-899', min: 800, max: 899 },
    { label: '900-999', min: 900, max: 999 },
  ];

  const currentRangeObj = ranges.find(r => r.label === activeRange) || ranges[0];

  const visibleNumbers = allNumbers.filter(num => {
    const val = parseInt(num, 10);
    if (searchTerm.trim() !== '') {
      return num.includes(searchTerm.trim());
    }
    return val >= currentRangeObj.min && val <= currentRangeObj.max;
  });

  const handleConfirmReservation = () => {
    if (!selectedNumber) {
      toast.error('Please select a 3-digit lucky invoice number from the grid');
      return;
    }

    const res = registerUser(user.name, user.phone, selectedNumber);
    if (res.success) {
      toast.success(`🎉 Invoice Ticket #${selectedNumber} reserved successfully!`);
      navigate(ROUTES.JOIN_LIVE);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-blue-900 flex items-center gap-2">
              <Hash size={24} className="text-blue-600" /> Step 2: Select Your Lucky Invoice Number (000–999)
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Participant: <strong className="text-slate-800 me-2">{user?.name}</strong> ({user?.phone})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-2">
              <span>Selected:</span>
              {selectedNumber ? (
                <span className="font-black text-blue-900 text-sm bg-blue-100 text-blue-900 px-2 py-0.5 rounded-lg border border-blue-200">
                  #{selectedNumber}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">None Selected</span>
              )}
            </div>

            <button
              type="button"
              disabled={!selectedNumber}
              onClick={handleConfirmReservation}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                selectedNumber
                  ? 'bg-blue-900 hover:bg-blue-950 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Ticket size={16} /> Confirm Ticket
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-2xl w-full md:w-64 border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search number (e.g. 987)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxLength={3}
              className="bg-transparent outline-none text-xs font-medium w-full text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ranges.map(r => (
              <button
                key={r.label}
                type="button"
                className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRange === r.label && !searchTerm
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setActiveRange(r.label);
                  setSearchTerm('');
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border border-slate-300"></span> Available</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-900 border border-blue-950"></span> Your Selected Number</div>
        </div>
      </div>

      {/* 000-999 Number Selection Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[460px] overflow-y-auto p-1">
          {visibleNumbers.map(num => {
            const isSelected = selectedNumber === num;

            return (
              <button
                key={num}
                type="button"
                className={`aspect-square border rounded-2xl font-black text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-950 shadow-md ring-4 ring-blue-200 scale-105'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => setSelectedNumber(num)}
              >
                <span>{num}</span>
                {isSelected && <Check size={12} className="text-amber-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
