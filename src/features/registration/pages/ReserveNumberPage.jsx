import React, { useState } from 'react';
import { useEvent } from '../../../context/EventContext';
import { useAuthStore } from '../../auth/authStore';
import { Ticket, User, Phone, Search, Lock, CheckCircle } from 'lucide-react';
import { UserTicket } from '../../../pages/user/UserTicket';

export const ReserveNumberPage = () => {
  const { user } = useAuthStore();
  const { 
    eventData, 
    currentUserTicket, 
    registerUser, 
    isInvoiceTaken 
  } = useEvent();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRange, setActiveRange] = useState('000-099');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    if (!selectedNumber) {
      setErrorMsg('Please select an invoice number from 000 to 999');
      return;
    }

    const result = registerUser(name.trim(), phone.trim(), selectedNumber);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessMsg(`Congratulations! Invoice #${selectedNumber} has been reserved for you.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <Ticket size={26} className="text-blue-600" /> Reserve Invoice Number (000–999)
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Pick an available 3-digit lucky number to reserve your spot for the live prize draw.</p>
      </div>

      {currentUserTicket ? (
        <UserTicket ticket={currentUserTicket} eventName={eventData.name} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-blue-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <User size={18} /> Step 1: Your Details
            </h2>

            {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">{errorMsg}</div>}
            {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold">{successMsg}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User size={13} /> Full Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone size={13} /> Phone Number
                </label>
                <input 
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Selected Number:</span>
                <span className="px-3 py-1 bg-blue-900 text-white rounded-lg font-black text-sm">
                  {selectedNumber ? `#${selectedNumber}` : 'None Selected'}
                </span>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-950 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                disabled={!selectedNumber}
              >
                <CheckCircle size={18} /> Confirm & Reserve Ticket
              </button>
            </form>
          </div>

          {/* Number Picker Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-blue-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Ticket size={18} /> Step 2: Select 3-Digit Lucky Number
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl w-full sm:w-60 border border-slate-200">
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

            <div className="flex gap-6 text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span> Available</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Selected</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></span> Taken</div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-1">
              {visibleNumbers.map(num => {
                const taken = isInvoiceTaken(num);
                const isSelected = selectedNumber === num;

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={taken}
                    className={`aspect-square border rounded-xl font-black text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      taken 
                        ? 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed opacity-70' 
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      if (!taken) setSelectedNumber(num);
                    }}
                  >
                    <span>{num}</span>
                    {taken && <Lock size={10} className="text-red-500 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
