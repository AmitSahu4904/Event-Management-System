import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventConfigSection } from './EventConfigSection';
import { WinnerDrawSection } from './WinnerDrawSection';
import { PrizeManagementSection } from './PrizeManagementSection';
import { ParticipantRosterSection } from './ParticipantRosterSection';

export const AdminPage = () => {
  const { 
    eventData, 
    registrations, 
    prizes,
    winners,
    currentDraftWinners,
    updateEventDetails, 
    updatePrizeRank, 
    drawAllFiveWinners, 
    redrawRank,
    publishWinners,
    realParticipantCount 
  } = useEvent();

  const [eventName, setEventName] = useState(eventData.name || '');
  const [startDate, setStartDate] = useState(eventData.startDate || '');
  const [endDate, setEndDate] = useState(eventData.endDate || '');
  const [isLive, setIsLive] = useState(eventData.status === 'LIVE');
  const [saveNotice, setSaveNotice] = useState('');
  const [drawResultNotice, setDrawResultNotice] = useState('');

  const handleSaveEvent = (e) => {
    e.preventDefault();
    updateEventDetails({ name: eventName, startDate, endDate, status: isLive ? 'LIVE' : 'UPCOMING' });
    setSaveNotice('Event details saved successfully!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleImageUpload = (rank, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const currentPrize = prizes.find(p => p.rank === rank);
      updatePrizeRank(rank, currentPrize?.name || `Rank ${rank} Prize`, base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handlePrizeNameChange = (rank, name) => {
    const currentPrize = prizes.find(p => p.rank === rank);
    updatePrizeRank(rank, name, currentPrize?.image);
  };

  const handleDrawAllWinners = () => {
    const res = drawAllFiveWinners();
    if (!res.success) {
      setDrawResultNotice(res.message);
    } else {
      setDrawResultNotice(`Successfully drawn ${res.count} draft winners for Ranks 1 to 5! Review below before publishing.`);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRedrawRank = (rank) => {
    const res = redrawRank(rank);
    if (!res.success) {
      setDrawResultNotice(res.message);
    } else {
      setDrawResultNotice(`Rank ${rank} winner redrawn: Invoice #${res.winner.invoiceNo} (${res.winner.name})`);
    }
  };

  const handlePublishWinners = () => {
    const res = publishWinners();
    if (res.success) {
      setDrawResultNotice('Winners published permanently to Live Display & Winner History!');
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  return (
    <div className="portal-container admin-portal">
      <div className="admin-header">
        <h1>
          <Settings size={28} className="icon" />
          ADMIN DASHBOARD
        </h1>
        <p className="admin-subtitle">Manage Event settings, 5 Rank Prizes, 000-999 Participants, 5-Winner Draw Engine, and Exports.</p>
      </div>

      <div className="admin-grid">
        <EventConfigSection
          eventName={eventName}
          setEventName={setEventName}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isLive={isLive}
          setIsLive={setIsLive}
          onSubmit={handleSaveEvent}
          saveNotice={saveNotice}
        />

        <WinnerDrawSection
          winners={winners}
          currentDraftWinners={currentDraftWinners}
          realParticipantCount={realParticipantCount}
          onDrawAllWinners={handleDrawAllWinners}
          onRedrawRank={handleRedrawRank}
          onPublishWinners={handlePublishWinners}
          drawResultNotice={drawResultNotice}
        />

        <PrizeManagementSection
          prizes={prizes}
          onImageUpload={handleImageUpload}
          onPrizeNameChange={handlePrizeNameChange}
        />

        <ParticipantRosterSection
          registrations={registrations}
          winnerHistory={winners}
        />
      </div>
    </div>
  );
};
