import React from 'react';
import { User, ShieldCheck, Tv, RefreshCw } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { eventData, resetToDefaults } = useEvent();

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        {/* Brand Title */}
        <div className="brand-logo-section">
          <div className="logo-sparkle">★</div>
          <span className="brand-title">{eventData.name || "DIVINE EMPIRE INDIA"}</span>
        </div>

        {/* Tab Buttons */}
        <div className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            <User size={18} />
            <span>User Portal</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>

          <button 
            className={`nav-tab-btn broadcast-tab ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <Tv size={18} />
            <span>Live Display View</span>
          </button>
        </div>

        {/* Reset Demo Data Button */}
        <button 
          className="reset-demo-btn"
          onClick={() => {
            if (window.confirm("Reset all event data, registrations, and winner to initial dummy data?")) {
              resetToDefaults();
            }
          }}
          title="Reset back to initial dummy data"
        >
          <RefreshCw size={14} />
          <span>Reset Demo</span>
        </button>
      </div>
    </nav>
  );
};
