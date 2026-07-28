import React from 'react';
import { Ticket, Search, Lock } from 'lucide-react';

export const NumberPickerGrid = ({
  selectedNumber,
  setSelectedNumber,
  searchTerm,
  setSearchTerm,
  activeRange,
  setActiveRange,
  ranges,
  visibleNumbers,
  isInvoiceTaken
}) => {
  const currentRangeObj = ranges.find(r => r.label === activeRange) || ranges[0];

  return (
    <div className="number-picker-card">
      <h2 className="section-title">
        <Ticket className="icon" size={20} />
        Step 2: Choose Invoice Number (000 - 999)
      </h2>

      <div className="grid-toolbar">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            placeholder="Search invoice number (e.g. 987)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={3}
          />
        </div>

        <div className="range-pills">
          {ranges.map(r => (
            <button 
              key={r.label}
              type="button"
              className={`range-pill-btn ${activeRange === r.label && !searchTerm ? 'active' : ''}`}
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

      <div className="grid-legend">
        <div className="legend-item"><span className="dot available"></span> Available</div>
        <div className="legend-item"><span className="dot selected"></span> Your Pick</div>
        <div className="legend-item"><span className="dot taken"></span> Taken (Locked)</div>
      </div>

      <div className="number-grid">
        {visibleNumbers.map(num => {
          const taken = isInvoiceTaken(num);
          const isSelected = selectedNumber === num;

          return (
            <button
              key={num}
              type="button"
              disabled={taken}
              className={`number-cell ${taken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (!taken) setSelectedNumber(num);
              }}
              title={taken ? `Invoice #${num} is already reserved` : `Select Invoice #${num}`}
            >
              <span className="num-text">{num}</span>
              {taken && <Lock size={10} className="lock-icon" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
