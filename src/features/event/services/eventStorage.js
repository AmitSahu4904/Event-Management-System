import { storageAdapter } from '@/shared/utils/storageAdapter';
import { INITIAL_PRIZES } from '@/data/dummyData';

const KEYS = {
  EVENTS_LIST: 'dei_v3_events_list',
  ACTIVE_EVENT_ID: 'dei_v3_active_event_id',
  EVENT_PREFIX: 'dei_v3_event_',
  PRIZES_PREFIX: 'dei_v3_prizes_'
};

export const eventStorage = {
  // --- Events List Operations ---
  getAllEvents: () => {
    return storageAdapter.get(KEYS.EVENTS_LIST, []);
  },

  saveAllEvents: (eventsList) => {
    storageAdapter.set(KEYS.EVENTS_LIST, eventsList);
  },

  getActiveEventId: () => {
    const list = eventStorage.getAllEvents();
    const activeId = storageAdapter.get(KEYS.ACTIVE_EVENT_ID, null);
    if (activeId && list.some(e => e.id === activeId)) {
      return activeId;
    }
    const defaultId = list[0]?.id || null;
    if (defaultId) {
      storageAdapter.set(KEYS.ACTIVE_EVENT_ID, defaultId);
    } else {
      storageAdapter.remove(KEYS.ACTIVE_EVENT_ID);
    }
    return defaultId;
  },

  setActiveEventId: (id) => {
    if (id) {
      storageAdapter.set(KEYS.ACTIVE_EVENT_ID, id);
    } else {
      storageAdapter.remove(KEYS.ACTIVE_EVENT_ID);
    }
    return id;
  },

  // --- Specific Event Config & Prizes ---
  getEvent: (eventId) => {
    const list = eventStorage.getAllEvents();
    const targetId = eventId || eventStorage.getActiveEventId() || list[0]?.id;
    if (!targetId) return null;

    const item = storageAdapter.get(`${KEYS.EVENT_PREFIX}${targetId}`, null);
    if (item && item.name && item.startDate && item.endDate) {
      return item;
    }
    
    // Fallback to entry in master events list if individual key is incomplete
    const listEntry = list.find(e => e.id === targetId) || list[0] || null;
    if (listEntry) {
      // Ensure key in storage is populated
      storageAdapter.set(`${KEYS.EVENT_PREFIX}${listEntry.id}`, listEntry);
    }
    return listEntry;
  },

  saveEvent: (eventId, eventData) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return;
    const existing = eventStorage.getEvent(targetId) || {};
    const updated = { ...existing, ...eventData, id: targetId };
    storageAdapter.set(`${KEYS.EVENT_PREFIX}${targetId}`, updated);

    if (eventData && Array.isArray(eventData.prizes)) {
      eventStorage.savePrizes(targetId, eventData.prizes);
    }

    // Update summary entry in events list
    const list = eventStorage.getAllEvents();
    const updatedList = list.map(e => (e.id === targetId ? updated : e));
    eventStorage.saveAllEvents(updatedList);
  },

  getPrizes: (eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return INITIAL_PRIZES;
    return storageAdapter.get(`${KEYS.PRIZES_PREFIX}${targetId}`, INITIAL_PRIZES);
  },

  savePrizes: (eventId, prizes) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return;
    storageAdapter.set(`${KEYS.PRIZES_PREFIX}${targetId}`, prizes);
  },

  createEvent: (newEventData) => {
    const id = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const slug = (newEventData.name || 'new-event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const fullEvent = {
      id,
      slug,
      name: newEventData.name || 'New Lucky Draw Event',
      logo: newEventData.logo || '',
      banner: newEventData.banner || '',
      description: newEventData.description || '',
      sponsor: newEventData.sponsor || 'Divine Empire Global',
      invoiceMin: newEventData.invoiceMin !== undefined ? Number(newEventData.invoiceMin) : 0,
      invoiceMax: newEventData.invoiceMax !== undefined ? Number(newEventData.invoiceMax) : 999,
      startDate: newEventData.startDate || new Date().toISOString().slice(0, 16),
      endDate: newEventData.endDate || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      liveStartDate: newEventData.liveStartDate || newEventData.startDate || new Date().toISOString().slice(0, 16),
      liveEndDate: newEventData.liveEndDate || newEventData.endDate || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: newEventData.status || 'UPCOMING',
      maxNumbers: 1000,
      autoStart: false,
      autoEnd: false,
      settings: {
        theme: "light",
        primaryColor: "#0b2567",
        animationSpeed: "normal",
        drawSpeed: "normal",
        confettiEnabled: true,
        autoPublish: false,
        fullscreen: false
      }
    };

    const currentList = eventStorage.getAllEvents();
    const updatedList = [fullEvent, ...currentList];
    eventStorage.saveAllEvents(updatedList);

    // Save individual event config & prizes
    storageAdapter.set(`${KEYS.EVENT_PREFIX}${id}`, fullEvent);
    const initialPrizesForEvent = newEventData.prizes || INITIAL_PRIZES;
    storageAdapter.set(`${KEYS.PRIZES_PREFIX}${id}`, initialPrizesForEvent);

    // Set as active event
    eventStorage.setActiveEventId(id);

    return fullEvent;
  },

  deleteEvent: (id) => {
    const currentList = eventStorage.getAllEvents();
    const updatedList = currentList.filter(e => e.id !== id);
    eventStorage.saveAllEvents(updatedList);

    storageAdapter.remove(`${KEYS.EVENT_PREFIX}${id}`);
    storageAdapter.remove(`${KEYS.PRIZES_PREFIX}${id}`);
    storageAdapter.remove(`dei_v3_participants_${id}`);
    storageAdapter.remove(`dei_v3_winners_${id}`);

    if (eventStorage.getActiveEventId() === id) {
      const nextActiveId = updatedList[0]?.id || null;
      eventStorage.setActiveEventId(nextActiveId);
    }
    return updatedList;
  },

  resetEventData: () => {
    storageAdapter.remove(KEYS.EVENTS_LIST);
    storageAdapter.remove(KEYS.ACTIVE_EVENT_ID);
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('dei_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error(e);
    }
    return [];
  }
};
