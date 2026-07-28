import { create } from 'zustand';
import { participantStorage } from '../../services/participantStorage';
import { formatInvoiceNo } from '../../utils/formatters';

export const useRegistrationStore = create((set, get) => ({
  participants: participantStorage.getParticipants(),
  userTicket: participantStorage.getUserTicket(),

  setUserTicket: (ticket) => {
    if (ticket) {
      participantStorage.saveUserTicket(ticket);
    } else {
      participantStorage.clearUserTicket();
    }
    set({ userTicket: ticket });
  },

  checkUserTicketByPhone: (phone) => {
    const cleanPhone = (phone || '').trim();
    const existing = get().participants.find(p => p.phone === cleanPhone);
    if (existing) {
      participantStorage.saveUserTicket(existing);
      set({ userTicket: existing });
      return existing;
    } else {
      participantStorage.clearUserTicket();
      set({ userTicket: null });
      return null;
    }
  },

  registerUser: (name, phone, invoiceNo) => {
    const res = participantStorage.registerParticipant(name, phone, invoiceNo);
    if (res.success) {
      set({
        participants: participantStorage.getParticipants(),
        userTicket: res.participant
      });
    }
    return res;
  },

  isInvoiceTaken: (invoiceNo) => {
    const formatted = formatInvoiceNo(invoiceNo);
    return get().participants.some(p => p.invoiceNo === formatted);
  },

  getParticipantByInvoice: (invoiceNo) => {
    const formatted = formatInvoiceNo(invoiceNo);
    return get().participants.find(p => p.invoiceNo === formatted);
  },

  resetRegistration: () => {
    const participants = participantStorage.resetParticipants();
    set({ participants, userTicket: null });
  }
}));
