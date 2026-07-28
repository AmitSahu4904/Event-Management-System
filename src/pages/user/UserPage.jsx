import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { LiveBadge } from '../../components/common/LiveBadge';
import { CountdownTimer } from '../../components/common/CountdownTimer';
import { UserTicket } from './UserTicket';
import { RegistrationForm } from './RegistrationForm';
import { NumberPickerGrid } from './NumberPickerGrid';

export const UserPage = () => {
  const { 
    eventData, 
    currentUserTicket, 
    registerUser, 
    isInvoiceTaken, 
    realParticipantCount 
  } = useEvent();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
      setSuccessMsg(`Congratulations! Invoice #${selectedNumber} has been reserved.`);
    }
  };

  return (
    <div className="portal-container user-portal">
      <header className="user-hero-header">
        <div className="hero-content">
          <LiveBadge isLive={eventData.isLive} participantCount={realParticipantCount} />
          <h1 className="hero-title">{eventData.name || 'DIVINE EMPIRE INDIA'}</h1>
          <p className="hero-subtitle">Select your lucky Invoice Number (000 - 999) to enter the live prize draw!</p>
          <CountdownTimer startDate={eventData.startDate} targetDate={eventData.endDate} />
        </div>
      </header>

      {currentUserTicket ? (
        <UserTicket ticket={currentUserTicket} eventName={eventData.name} />
      ) : (
        <div className="registration-flow">
          <RegistrationForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            selectedNumber={selectedNumber}
            onSubmit={handleRegister}
            errorMsg={errorMsg}
            successMsg={successMsg}
          />

          <NumberPickerGrid
            selectedNumber={selectedNumber}
            setSelectedNumber={setSelectedNumber}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeRange={activeRange}
            setActiveRange={setActiveRange}
            ranges={ranges}
            visibleNumbers={visibleNumbers}
            isInvoiceTaken={isInvoiceTaken}
          />
        </div>
      )}
    </div>
  );
};
