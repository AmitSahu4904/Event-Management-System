import React from 'react';
import { User, Phone, CheckCircle } from 'lucide-react';

export const RegistrationForm = ({
  name,
  setName,
  phone,
  setPhone,
  selectedNumber,
  onSubmit,
  errorMsg,
  successMsg
}) => {
  return (
    <div className="user-form-card">
      <h2 className="section-title">
        <User className="icon" size={20} />
        Step 1: Enter Your Details
      </h2>

      {errorMsg && <div className="alert-box error">{errorMsg}</div>}
      {successMsg && <div className="alert-box success">{successMsg}</div>}

      <form onSubmit={onSubmit} className="user-details-form">
        <div className="form-group">
          <label>
            <User size={16} /> Full Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <Phone size={16} /> Phone Number
          </label>
          <input 
            type="tel" 
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="selected-number-preview">
          <span>Selected Invoice Number:</span>
          <span className="number-pill">
            {selectedNumber ? `#${selectedNumber}` : 'None Selected'}
          </span>
        </div>

        <button 
          type="submit" 
          className="submit-registration-btn"
          disabled={!selectedNumber}
        >
          <CheckCircle size={18} /> Confirm & Reserve Ticket
        </button>
      </form>
    </div>
  );
};
