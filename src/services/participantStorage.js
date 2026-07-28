import { storageAdapter, sessionStorageAdapter } from './storageAdapter';
import { formatInvoiceNo } from '../utils/formatters';
import { eventStorage } from './eventStorage';

const PREFIX = 'dei_v3_participants_';
const TICKET_PREFIX = 'dei_v3_user_ticket_';

export const participantStorage = {
  getParticipants: (eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return [];
    return storageAdapter.get(`${PREFIX}${targetId}`, []);
  },

  saveParticipants: (eventId, list) => {
    if (Array.isArray(eventId)) {
      const targetId = eventStorage.getActiveEventId();
      if (targetId) storageAdapter.set(`${PREFIX}${targetId}`, eventId);
      return;
    }
    const targetId = eventId || eventStorage.getActiveEventId();
    if (targetId) storageAdapter.set(`${PREFIX}${targetId}`, list);
  },

  getUserTicket: (eventId, phone) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return null;
    const cleanPhone = (phone || '').trim();

    if (cleanPhone) {
      const sessionTicket = sessionStorageAdapter.get(`${TICKET_PREFIX}${targetId}_${cleanPhone}`, null);
      if (sessionTicket) return sessionTicket;
      return storageAdapter.get(`${TICKET_PREFIX}${targetId}_${cleanPhone}`, null);
    }

    const sessionTicket = sessionStorageAdapter.get(`${TICKET_PREFIX}${targetId}`, null);
    if (sessionTicket) return sessionTicket;
    return storageAdapter.get(`${TICKET_PREFIX}${targetId}`, null);
  },

  saveUserTicket: (eventId, phone, ticket) => {
    let targetId = eventId;
    let targetPhone = phone;
    let targetTicket = ticket;

    // Handle overload: saveUserTicket(ticket) or saveUserTicket(eventId, ticket)
    if (typeof eventId === 'object' && eventId !== null) {
      targetId = eventStorage.getActiveEventId();
      targetTicket = eventId;
      targetPhone = targetTicket.phone;
    } else if (typeof phone === 'object' && phone !== null) {
      targetTicket = phone;
      targetPhone = targetTicket.phone;
    }

    if (!targetId) targetId = eventStorage.getActiveEventId();
    const cleanPhone = (targetPhone || targetTicket?.phone || '').trim();

    if (targetId && cleanPhone && targetTicket) {
      sessionStorageAdapter.set(`${TICKET_PREFIX}${targetId}_${cleanPhone}`, targetTicket);
      sessionStorageAdapter.set(`${TICKET_PREFIX}${targetId}`, targetTicket);
      storageAdapter.set(`${TICKET_PREFIX}${targetId}_${cleanPhone}`, targetTicket);
      storageAdapter.set(`${TICKET_PREFIX}${targetId}`, targetTicket);
    } else if (targetId && targetTicket) {
      sessionStorageAdapter.set(`${TICKET_PREFIX}${targetId}`, targetTicket);
      storageAdapter.set(`${TICKET_PREFIX}${targetId}`, targetTicket);
    }
  },

  clearUserTicket: (eventId, phone) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    const cleanPhone = (phone || '').trim();
    if (targetId && cleanPhone) {
      sessionStorageAdapter.remove(`${TICKET_PREFIX}${targetId}_${cleanPhone}`);
      storageAdapter.remove(`${TICKET_PREFIX}${targetId}_${cleanPhone}`);
    }
    if (targetId) {
      sessionStorageAdapter.remove(`${TICKET_PREFIX}${targetId}`);
      storageAdapter.remove(`${TICKET_PREFIX}${targetId}`);
    }
  },

  registerParticipant: (name, phone, invoiceNo, eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) {
      return { success: false, message: 'No active event selected.' };
    }

    const participants = participantStorage.getParticipants(targetId);
    const formattedInvoice = formatInvoiceNo(invoiceNo);

    // Validation: Phone length & Duplicate Phone check
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, message: 'Please enter a valid phone number (minimum 8 digits).' };
    }

    const existingPhone = participants.find(p => p.phone === cleanPhone);
    if (existingPhone) {
      return { success: false, message: `Phone number ${cleanPhone} is already registered under Invoice #${existingPhone.invoiceNo}.` };
    }

    const newParticipant = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      invoiceNo: formattedInvoice,
      name: name.trim(),
      phone: cleanPhone,
      timestamp: new Date().toISOString(),
      status: 'REGISTERED'
    };

    const updatedList = [...participants, newParticipant];
    participantStorage.saveParticipants(targetId, updatedList);
    participantStorage.saveUserTicket(targetId, cleanPhone, newParticipant);

    return { success: true, participant: newParticipant };
  },

  resetParticipants: (eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (targetId) {
      storageAdapter.set(`${PREFIX}${targetId}`, []);
      sessionStorageAdapter.remove(`${TICKET_PREFIX}${targetId}`);
      storageAdapter.remove(`${TICKET_PREFIX}${targetId}`);
    }
    return [];
  }
};
