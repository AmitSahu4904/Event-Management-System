import React, { useState } from 'react';
import { Users, Download, Search, FileText, Table as TableIcon } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { Button } from '../../shared/components/Button';

export const ParticipantRosterSection = ({ registrations = [], winnerHistory = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'winners'

  const filteredParticipants = registrations.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p.invoiceNo.includes(searchTerm)
  );

  const winnerIds = new Set(winnerHistory.map(w => w.participantId));

  // Export handlers for Participants
  const handleExportParticipantsCSV = () => {
    const data = registrations.map(r => ({
      "Invoice No": r.invoiceNo,
      "Name": r.name,
      "Phone": r.phone,
      "Registered Time": formatDateTime(r.timestamp),
      "Status": winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    }));
    exportToCSV(data, 'Participants_List.csv');
  };

  const handleExportParticipantsExcel = () => {
    const data = registrations.map(r => ({
      "Invoice No": r.invoiceNo,
      "Name": r.name,
      "Phone": r.phone,
      "Registered Time": formatDateTime(r.timestamp),
      "Status": winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    }));
    exportToExcel(data, 'Participants_List.xlsx', 'Participants');
  };

  const handleExportParticipantsPDF = () => {
    const columns = ["Invoice", "Name", "Phone", "Registered Time", "Status"];
    const rows = registrations.map(r => [
      `#${r.invoiceNo}`,
      r.name,
      r.phone,
      formatDateTime(r.timestamp),
      winnerIds.has(r.id) ? "WINNER" : "REGISTERED"
    ]);
    exportToPDF("Divine Empire India - Registered Participants", columns, rows, 'Participants_List.pdf');
  };

  // Export handlers for Winners
  const handleExportWinnersCSV = () => {
    const data = winnerHistory.map(w => ({
      "Rank": w.rank,
      "Prize": w.prizeName || `Rank ${w.rank}`,
      "Invoice No": w.invoiceNo,
      "Name": w.name,
      "Phone": w.phone,
      "Draw Time": formatDateTime(w.drawTime)
    }));
    exportToCSV(data, 'Winners_History.csv');
  };

  const handleExportWinnersExcel = () => {
    const data = winnerHistory.map(w => ({
      "Rank": w.rank,
      "Prize": w.prizeName || `Rank ${w.rank}`,
      "Invoice No": w.invoiceNo,
      "Name": w.name,
      "Phone": w.phone,
      "Draw Time": formatDateTime(w.drawTime)
    }));
    exportToExcel(data, 'Winners_History.xlsx', 'Winners');
  };

  const handleExportWinnersPDF = () => {
    const columns = ["Rank", "Prize", "Invoice", "Name", "Phone", "Draw Time"];
    const rows = winnerHistory.map(w => [
      `Rank ${w.rank}`,
      w.prizeName || `Rank ${w.rank}`,
      `#${w.invoiceNo}`,
      w.name,
      w.phone,
      formatDateTime(w.drawTime)
    ]);
    exportToPDF("Divine Empire India - Winners History", columns, rows, 'Winners_History.pdf');
  };

  return (
    <div className="admin-card full-width">
      <div className="roster-header">
        <h2>
          <Users size={20} className="icon" />
          Participant Roster & Winner History
        </h2>

        {/* Export Toolbar */}
        <div className="export-toolbar">
          <span className="export-label"><Download size={14} /> Export:</span>
          {activeTab === 'participants' ? (
            <>
              <button className="export-btn" onClick={handleExportParticipantsCSV}>CSV</button>
              <button className="export-btn" onClick={handleExportParticipantsExcel}>Excel</button>
              <button className="export-btn" onClick={handleExportParticipantsPDF}>PDF</button>
            </>
          ) : (
            <>
              <button className="export-btn" onClick={handleExportWinnersCSV}>CSV</button>
              <button className="export-btn" onClick={handleExportWinnersExcel}>Excel</button>
              <button className="export-btn" onClick={handleExportWinnersPDF}>PDF</button>
            </>
          )}
        </div>
      </div>

      {/* Roster Controls & Tabs */}
      <div className="roster-controls">
        <div className="roster-tabs">
          <button 
            className={`roster-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            All Participants ({registrations.length})
          </button>
          <button 
            className={`roster-tab-btn ${activeTab === 'winners' ? 'active' : ''}`}
            onClick={() => setActiveTab('winners')}
          >
            5 Rank Winners History ({winnerHistory.length})
          </button>
        </div>

        {activeTab === 'participants' && (
          <div className="search-input-box roster-search">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search name, phone, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="participants-table-wrapper">
        {activeTab === 'participants' ? (
          <table className="participants-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Participant Name</th>
                <th>Phone Number</th>
                <th>Registration Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-table-cell">No matching registered participants found.</td>
                </tr>
              ) : (
                filteredParticipants.map(reg => {
                  const isWinner = winnerIds.has(reg.id);
                  return (
                    <tr key={reg.id || reg.invoiceNo} className={isWinner ? 'winner-row' : ''}>
                      <td className="invoice-cell">#{reg.invoiceNo}</td>
                      <td className="name-cell">{reg.name}</td>
                      <td className="phone-cell">{reg.phone}</td>
                      <td className="time-cell">{formatDateTime(reg.timestamp)}</td>
                      <td className="status-cell">
                        {isWinner ? (
                          <span className="badge winner-badge">WINNER</span>
                        ) : (
                          <span className="badge reserved-badge">Reserved</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          <table className="participants-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Prize</th>
                <th>Invoice No.</th>
                <th>Winner Name</th>
                <th>Phone Number</th>
                <th>Draw Time</th>
              </tr>
            </thead>
            <tbody>
              {winnerHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">No winners published yet.</td>
                </tr>
              ) : (
                winnerHistory.map(w => (
                  <tr key={w.rank} className="winner-row">
                    <td className="invoice-cell">Rank {w.rank}</td>
                    <td className="name-cell">{w.prizeName || `Prize ${w.rank}`}</td>
                    <td className="invoice-cell">#{w.invoiceNo}</td>
                    <td className="name-cell">{w.name}</td>
                    <td className="phone-cell">{w.phone}</td>
                    <td className="time-cell">{formatDateTime(w.drawTime)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
