import { INITIAL_EVENT_DATA, DUMMY_REGISTRATIONS } from '../utils/dummyData';

const KEYS = {
  EVENT_DATA: 'dei_event_data',
  REGISTRATIONS: 'dei_registrations',
  USER_TICKET: 'dei_user_ticket'
};

export const storageService = {
  getEventData: () => {
    const saved = localStorage.getItem(KEYS.EVENT_DATA);
    return saved ? JSON.parse(saved) : INITIAL_EVENT_DATA;
  },

  saveEventData: (data) => {
    localStorage.setItem(KEYS.EVENT_DATA, JSON.stringify(data));
  },

  getRegistrations: () => {
    const saved = localStorage.getItem(KEYS.REGISTRATIONS);
    return saved ? JSON.parse(saved) : DUMMY_REGISTRATIONS;
  },

  saveRegistrations: (registrations) => {
    localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(registrations));
  },

  getUserTicket: () => {
    const saved = localStorage.getItem(KEYS.USER_TICKET);
    return saved ? JSON.parse(saved) : null;
  },

  saveUserTicket: (ticket) => {
    if (ticket) {
      localStorage.setItem(KEYS.USER_TICKET, JSON.stringify(ticket));
    } else {
      localStorage.removeItem(KEYS.USER_TICKET);
    }
  },

  clearAll: () => {
    localStorage.removeItem(KEYS.EVENT_DATA);
    localStorage.removeItem(KEYS.REGISTRATIONS);
    localStorage.removeItem(KEYS.USER_TICKET);
  }
};
