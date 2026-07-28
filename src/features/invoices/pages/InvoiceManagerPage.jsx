import React, { useState } from 'react';
import { useEvent } from '../../../context/EventContext';
import { Hash, Search, Lock, UserCheck, Unlock, PlusCircle, X, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const InvoiceManagerPage = () => {
  const { registrations, registerUser, removeRegistration } = useEvent();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRange, setActiveRange] = useState('000-099');
  
  // Selected slot modal state for admin manual controls
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [assignName, setAssignName] = useState('');
  const [assignPhone, setAssignPhone] = useState('');

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

  const handleManualAssign = (e) => {
    e.preventDefault();
    if (!assignName.trim() || !assignPhone.trim()) {
      toast.error('Please enter name and phone number');
      return;
    }

    const res = registerUser(assignName.trim(), assignPhone.trim(), selectedSlot);
    if (res.success) {
      toast.success(`Invoice #${selectedSlot} assigned to ${assignName.trim()}`);
      setAssignName('');
      setAssignPhone('');
    } else {
      toast.error(res.message);
    }
  };

  const handleReleaseParticipant = (invoiceNo, participantName) => {
    if (window.confirm(`Are you sure you want to remove "${participantName}" from Invoice #${invoiceNo}?`)) {
      if (removeRegistration) {
        removeRegistration(invoiceNo);
        toast.success(`Participant "${participantName}" removed`);
      }
    }
  };

  const slotRegistrations = selectedSlot ? registrations.filter(r => r.invoiceNo === selectedSlot) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <Hash size={26} className="text-blue-600" /> Invoice Manager (000–999)
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Monitor real-time invoice reservations. Multiple participants can choose the same number for shared winning draws.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Toolbar & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl w-full md:w-64 border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice (e.g. 987)..." 
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
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span> Available (0 Participants)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></span> Chosen (1+ Participants)
          </div>
        </div>

        {/* 000-999 Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-1">
          {visibleNumbers.map(num => {
            const matches = registrations.filter(r => r.invoiceNo === num);
            const count = matches.length;

            return (
              <button
                key={num}
                type="button"
                className={`aspect-square border rounded-xl font-black text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer active:scale-95 ${
                  count > 0 
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onClick={() => {
                  setSelectedSlot(num);
                  setAssignName('');
                  setAssignPhone('');
                }}
                title={count > 0 ? `Invoice #${num} chosen by ${count} participant(s) - Click to manage` : `Invoice #${num} available - Click to assign`}
              >
                <span>{num}</span>
                {count > 0 && (
                  <span className="text-[9px] font-extrabold text-red-600 flex items-center gap-0.5 mt-0.5">
                    <Users size={9} /> {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Action Modal for Selected Invoice Slot */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-900">Invoice #{selectedSlot}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  {slotRegistrations.length} Participant(s)
                </span>
              </div>
              <button 
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedSlot(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* List of Registered Participants for this Slot */}
            {slotRegistrations.length > 0 && (
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Registered Participants</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {slotRegistrations.map(r => (
                    <div key={r.id || r.phone} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-800">{r.name}</div>
                        <div className="text-[10px] font-semibold text-slate-500">{r.phone}</div>
                      </div>
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        onClick={() => handleReleaseParticipant(selectedSlot, r.name)}
                        title="Remove participant"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form to Assign another participant */}
            <form onSubmit={handleManualAssign} className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Assign Another Participant to #{selectedSlot}</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Participant Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={assignPhone}
                  onChange={(e) => setAssignPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 cursor-pointer"
                  onClick={() => setSelectedSlot(null)}
                >
                  Done
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle size={15} /> Assign to #{selectedSlot}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
