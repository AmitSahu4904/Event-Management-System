import React, { useState } from 'react';
import { useEvent } from '../../../context/EventContext';
import { Users, Search, Download, UserPlus, Trash2, X, CheckCircle } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatters';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import { toast } from 'sonner';

export const ParticipantsPage = () => {
  const { registrations, winners, registerUser, removeRegistration, isInvoiceTaken } = useEvent();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'WINNER' | 'REGISTERED'

  // Modal State for Manual Participant Registration
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addInvoiceNo, setAddInvoiceNo] = useState('');

  const winnerIds = new Set(winners.map(w => w.participantId));

  const filtered = registrations.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm) ||
                          p.invoiceNo.includes(searchTerm);
    const isWinner = winnerIds.has(p.id);

    if (statusFilter === 'WINNER') return matchesSearch && isWinner;
    if (statusFilter === 'REGISTERED') return matchesSearch && !isWinner;
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const data = registrations.map(r => ({
      "Invoice No": r.invoiceNo,
      "Name": r.name,
      "Phone": r.phone,
      "Registered Time": formatDateTime(r.timestamp),
      "Status": winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    }));
    exportToCSV(data, 'Participants_Roster.csv');
    toast.success('Participants roster exported as CSV');
  };

  const handleExportExcel = () => {
    const data = registrations.map(r => ({
      "Invoice No": r.invoiceNo,
      "Name": r.name,
      "Phone": r.phone,
      "Registered Time": formatDateTime(r.timestamp),
      "Status": winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    }));
    exportToExcel(data, 'Participants_Roster.xlsx', 'Participants');
    toast.success('Participants roster exported as Excel');
  };

  const handleExportPDF = () => {
    const columns = ["Invoice", "Name", "Phone", "Registered Time", "Status"];
    const rows = registrations.map(r => [
      `#${r.invoiceNo}`,
      r.name,
      r.phone,
      formatDateTime(r.timestamp),
      winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    ]);
    exportToPDF("Lucky Draw - Registered Participants Roster", columns, rows, 'Participants_Roster.pdf');
    toast.success('Participants roster exported as PDF');
  };

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

  const handleDeleteParticipant = (invoiceNo, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" (Invoice #${invoiceNo})?`)) {
      removeRegistration(invoiceNo);
      toast.success(`Participant "${name}" removed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
            <Users size={26} className="text-blue-600" /> Participant Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Search, filter, view, add, and export all 000–999 registered participants.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button" 
            className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={16} /> Add Participant
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

          <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Download size={14} /> Export:</span>
          <button className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-900 hover:text-white transition-all cursor-pointer active:scale-95" onClick={handleExportCSV}>CSV</button>
          <button className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-900 hover:text-white transition-all cursor-pointer active:scale-95" onClick={handleExportExcel}>Excel</button>
          <button className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-900 hover:text-white transition-all cursor-pointer active:scale-95" onClick={handleExportPDF}>PDF</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl w-full sm:w-72 border border-slate-200">
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
            <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'ALL' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setStatusFilter('ALL')}>All ({registrations.length})</button>
            <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'WINNER' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setStatusFilter('WINNER')}>Winners ({winners.length})</button>
            <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === 'REGISTERED' ? 'bg-blue-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setStatusFilter('REGISTERED')}>Registered ({registrations.length - winners.length})</button>
          </div>
        </div>

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-semibold">No matching participants found.</td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isWinner = winnerIds.has(p.id);
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
      </div>

      {/* Add Participant Modal */}
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
