import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEventStore } from '../features/event/eventStore';
import { useRegistrationStore } from '../features/registration/registrationStore';
import { usePrizesStore } from '../features/prizes/prizesStore';
import { useDrawStore } from '../features/draw/drawStore';
import { participantStorage } from '../services/participantStorage';
import { winnerStorage } from '../services/winnerStorage';
import { eventStorage as eventStorageService } from '../services/eventStorage';
import { parseEventDate } from '../utils/formatters';

const EventContext = createContext();

const INITIAL_NOTIFICATIONS = [
  { id: '1', text: 'System initialized with multi-event engine.', time: 'Just now', read: false },
  { id: '2', text: '000-999 Invoice grid initialized.', time: '5m ago', read: false },
  { id: '3', text: 'Rank Prize Structure active.', time: '10m ago', read: false }
];

export const EventProvider = ({ children }) => {
  // One-time cleanup of old stored dummy data in browser localStorage
  if (typeof window !== 'undefined' && localStorage.getItem('dei_v5_clean_dummy_data') !== 'true') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('dei_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('dei_v5_clean_dummy_data', 'true');
  }

  // Multi-event list and active event ID
  const [eventsList, setEventsList] = useState(() => eventStorageService.getAllEvents());
  const [activeEventId, setActiveEventIdState] = useState(() => eventStorageService.getActiveEventId());

  // Active Event Data & scoped collections
  const [eventData, setEventData] = useState(() => eventStorageService.getEvent(activeEventId));
  const [prizes, setPrizes] = useState(() => eventStorageService.getPrizes(activeEventId));
  const [participants, setParticipants] = useState(() => participantStorage.getParticipants(activeEventId));
  const [winners, setWinners] = useState(() => winnerStorage.getWinners(activeEventId));

  // Current draft winners & notifications
  const [currentDraftWinners, setCurrentDraftWinners] = useState([]);
  const [userTicket, setUserTicketState] = useState(() => participantStorage.getUserTicket(activeEventId));
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Sync state whenever activeEventId changes
  const refreshEventContext = (targetId) => {
    const validId = targetId || eventStorageService.getActiveEventId();
    const all = eventStorageService.getAllEvents();
    setEventsList(all);
    setActiveEventIdState(validId);

    const event = eventStorageService.getEvent(validId);
    setEventData(event);

    const eventPrizes = eventStorageService.getPrizes(validId);
    setPrizes(eventPrizes);

    const eventParticipants = participantStorage.getParticipants(validId);
    setParticipants(eventParticipants);

    const eventWinners = winnerStorage.getWinners(validId);
    setWinners(eventWinners);

    const ticket = participantStorage.getUserTicket(validId);
    setUserTicketState(ticket);

    setCurrentDraftWinners([]);

    // Sync Zustand stores for components directly relying on Zustand selectors
    useEventStore.setState({ event });
    useRegistrationStore.setState({ participants: eventParticipants, userTicket: ticket });
    usePrizesStore.setState({ prizes: eventPrizes });
    useDrawStore.setState({ winners: eventWinners, currentDraftWinners: [] });
  };

  useEffect(() => {
    refreshEventContext(activeEventId);
  }, [activeEventId]);

  // Automatic immediate winner draw & publish upon event end
  useEffect(() => {
    if (!eventData?.endDate) return;
    const end = parseEventDate(eventData.endDate);
    if (!end) return;

    const checkAndDraw = () => {
      const now = new Date();
      if (now >= end) {
        const existingWinners = winnerStorage.getWinners(activeEventId);
        if (existingWinners && existingWinners.length > 0) return;

        const eventParticipants = participantStorage.getParticipants(activeEventId);
        if (!eventParticipants || eventParticipants.length === 0) return;

        // Execute automatic draw & publish immediately
        const distinctInvoices = Array.from(new Set(eventParticipants.map(p => p.invoiceNo)));
        const availableInvoices = [...distinctInvoices];
        const eventPrizes = eventStorageService.getPrizes(activeEventId);
        const autoWinners = [];

        for (let rank = 1; rank <= 5; rank++) {
          if (availableInvoices.length === 0) break;
          const prize = eventPrizes.find(p => p.rank === rank);
          const randomIndex = Math.floor(Math.random() * availableInvoices.length);
          const winningInvoice = availableInvoices.splice(randomIndex, 1)[0];

          const matchingParticipants = eventParticipants.filter(p => p.invoiceNo === winningInvoice);
          const winnerNames = matchingParticipants.map(p => p.name).join(', ');
          const winnerPhones = matchingParticipants.map(p => p.phone).join(', ');

          autoWinners.push({
            rank,
            prizeName: prize?.name || `Prize ${rank}`,
            invoiceNo: winningInvoice,
            name: winnerNames || 'Winning Ticket Participant',
            phone: winnerPhones || '---',
            participantIds: matchingParticipants.map(p => p.id),
            participantsCount: matchingParticipants.length,
            drawTime: new Date().toISOString(),
            published: true
          });
        }

        if (autoWinners.length > 0) {
          const published = winnerStorage.publishWinners(activeEventId, autoWinners);
          setWinners(published);
          useDrawStore.setState({ winners: published, currentDraftWinners: [] });
          addNotification(`Automated draw executed & winners published immediately upon event end.`);
        }
      }
    };

    checkAndDraw();
    const timer = setInterval(checkAndDraw, 1000);
    return () => clearInterval(timer);
  }, [eventData?.endDate, activeEventId]);

  const setActiveEvent = (id) => {
    eventStorageService.setActiveEventId(id);
    setActiveEventIdState(id);
    refreshEventContext(id);
    addNotification(`Active event switched to "${eventStorageService.getEvent(id)?.name || id}"`);
  };

  const createEvent = (data) => {
    const newEvt = eventStorageService.createEvent(data);
    refreshEventContext(newEvt.id);
    addNotification(`New Event "${newEvt.name}" created successfully.`);
    return newEvt;
  };

  const updateEventDetails = (fields) => {
    eventStorageService.saveEvent(activeEventId, fields);
    refreshEventContext(activeEventId);
    addNotification(`Event details updated for "${eventData.name}".`);
  };

  const deleteEvent = (id) => {
    const updatedList = eventStorageService.deleteEvent(id);
    const newActiveId = eventStorageService.getActiveEventId();
    refreshEventContext(newActiveId);
    addNotification(`Event was deleted.`);
  };

  const addNotification = (text) => {
    const newLog = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newLog, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Participant Registration
  const registerUser = (name, phone, invoiceNo) => {
    const res = participantStorage.registerParticipant(name, phone, invoiceNo, activeEventId);
    if (res.success) {
      const updatedList = participantStorage.getParticipants(activeEventId);
      setParticipants(updatedList);
      setUserTicketState(res.participant);
      useRegistrationStore.setState({ participants: updatedList, userTicket: res.participant });
      addNotification(`New participant "${name}" reserved Invoice #${invoiceNo}`);
    }
    return res;
  };

  const removeRegistration = (invoiceNo) => {
    const updated = participants.filter(p => p.invoiceNo !== invoiceNo);
    participantStorage.saveParticipants(activeEventId, updated);
    setParticipants(updated);
    useRegistrationStore.setState({ participants: updated });
    addNotification(`Invoice #${invoiceNo} released and unassigned.`);
  };

  const checkUserTicketByPhone = (phone, targetEventId) => {
    const eventId = targetEventId || activeEventId;
    const cleanPhone = (phone || '').trim();
    const eventParticipants = participantStorage.getParticipants(eventId);
    const existing = eventParticipants.find(p => p.phone === cleanPhone);

    if (existing) {
      participantStorage.saveUserTicket(eventId, cleanPhone, existing);
      setUserTicketState(existing);
      return existing;
    } else {
      participantStorage.clearUserTicket(eventId, cleanPhone);
      setUserTicketState(null);
      return null;
    }
  };

  const setUserTicket = (ticket, targetEventId) => {
    const eventId = targetEventId || activeEventId;
    if (ticket && ticket.phone) {
      participantStorage.saveUserTicket(eventId, ticket.phone, ticket);
    } else if (ticket) {
      participantStorage.saveUserTicket(eventId, ticket);
    } else {
      participantStorage.clearUserTicket(eventId);
    }
    setUserTicketState(ticket);
  };

  const isInvoiceTaken = (invoiceNo) => {
    // Multi-participant mode: Invoice numbers can be chosen by multiple participants
    return false;
  };

  const getInvoiceParticipantCount = (invoiceNo) => {
    const formatted = String(invoiceNo).padStart(3, '0');
    return participants.filter(p => p.invoiceNo === formatted).length;
  };

  const updatePrizeRank = (rank, name, image) => {
    const updated = prizes.map(p => p.rank === rank ? { ...p, name, image } : p);
    eventStorageService.savePrizes(activeEventId, updated);
    setPrizes(updated);
    usePrizesStore.setState({ prizes: updated });
    addNotification(`Rank ${rank} prize details updated: ${name}`);
  };

  // Draw Logic: Winning Invoice Number activates ALL participants who chose that invoice number
  const drawAllFiveWinners = () => {
    if (participants.length === 0) {
      return { success: false, message: "No registered participants available to draw!" };
    }

    // Get list of distinct registered invoice numbers
    const distinctInvoices = Array.from(new Set(participants.map(p => p.invoiceNo)));
    const availableInvoices = [...distinctInvoices];
    const draftWinners = [];

    for (let rank = 1; rank <= 5; rank++) {
      if (availableInvoices.length === 0) break;
      const prize = prizes.find(p => p.rank === rank);
      const randomIndex = Math.floor(Math.random() * availableInvoices.length);
      const winningInvoice = availableInvoices.splice(randomIndex, 1)[0];

      const matchingParticipants = participants.filter(p => p.invoiceNo === winningInvoice);
      const winnerNames = matchingParticipants.map(p => p.name).join(', ');
      const winnerPhones = matchingParticipants.map(p => p.phone).join(', ');

      draftWinners.push({
        rank,
        prizeName: prize?.name || `Prize ${rank}`,
        invoiceNo: winningInvoice,
        name: winnerNames || 'Winning Ticket Participant',
        phone: winnerPhones || '---',
        participantIds: matchingParticipants.map(p => p.id),
        participantsCount: matchingParticipants.length,
        drawTime: new Date().toISOString(),
        published: false
      });
    }

    setCurrentDraftWinners(draftWinners);
    addNotification(`5-Winner Draft executed across Ranks 1 to 5.`);
    return { success: true, count: draftWinners.length, winners: draftWinners };
  };

  const redrawRank = (rank) => {
    const existingDrawnInvoices = currentDraftWinners.filter(w => w.rank !== rank).map(w => w.invoiceNo);
    const distinctInvoices = Array.from(new Set(participants.map(p => p.invoiceNo)));
    const available = distinctInvoices.filter(inv => !existingDrawnInvoices.includes(inv));

    if (available.length === 0) {
      return { success: false, message: "No additional distinct invoices available to redraw." };
    }

    const prize = prizes.find(p => p.rank === rank);
    const randomIndex = Math.floor(Math.random() * available.length);
    const winningInvoice = available[randomIndex];

    const matchingParticipants = participants.filter(p => p.invoiceNo === winningInvoice);
    const winnerNames = matchingParticipants.map(p => p.name).join(', ');
    const winnerPhones = matchingParticipants.map(p => p.phone).join(', ');

    const newWinner = {
      rank,
      prizeName: prize?.name || `Prize ${rank}`,
      invoiceNo: winningInvoice,
      name: winnerNames || 'Winning Ticket Participant',
      phone: winnerPhones || '---',
      participantIds: matchingParticipants.map(p => p.id),
      participantsCount: matchingParticipants.length,
      drawTime: new Date().toISOString(),
      published: false
    };

    const updatedDraft = currentDraftWinners.map(w => w.rank === rank ? newWinner : w);
    setCurrentDraftWinners(updatedDraft);
    addNotification(`Rank ${rank} winner redrawn: Invoice #${winningInvoice}`);
    return { success: true, winner: newWinner };
  };

  const publishWinners = () => {
    if (currentDraftWinners.length === 0) return { success: false, message: "No winners drawn to publish." };

    const published = winnerStorage.publishWinners(activeEventId, currentDraftWinners);
    setWinners(published);
    useDrawStore.setState({ winners: published, currentDraftWinners: [] });

    addNotification(`Winners roster published permanently to Live Display.`);
    return { success: true, published };
  };

  const resetToDefaults = () => {
    eventStorageService.resetEventData();
    refreshEventContext();
    addNotification('System reset to default initial state.');
  };

  // Theme support
  useEffect(() => {
    const theme = eventData?.settings?.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [eventData?.settings?.theme]);

  return (
    <EventContext.Provider value={{
      eventsList,
      activeEventId,
      eventData,
      registrations: participants,
      currentUserTicket: userTicket,
      realParticipantCount: participants.length,
      prizes,
      winners,
      currentDraftWinners,
      notifications,
      setActiveEvent,
      createEvent,
      updateEventDetails,
      deleteEvent,
      addNotification,
      markNotificationsRead,
      clearNotifications,
      registerUser,
      removeRegistration,
      checkUserTicketByPhone,
      setUserTicket,
      isInvoiceTaken,
      updatePrizeRank,
      drawAllFiveWinners,
      redrawRank,
      publishWinners,
      resetToDefaults
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
