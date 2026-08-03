import { storageAdapter } from '@/shared/utils/storageAdapter';
import { eventStorage } from '@/features/event/services/eventStorage';

const PREFIX = 'dei_v3_winners_';

export const winnerStorage = {
  getWinners: (eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (!targetId) return [];
    return storageAdapter.get(`${PREFIX}${targetId}`, []);
  },

  saveWinners: (eventId, winners) => {
    if (Array.isArray(eventId)) {
      const targetId = eventStorage.getActiveEventId();
      if (targetId) storageAdapter.set(`${PREFIX}${targetId}`, eventId);
      return;
    }
    const targetId = eventId || eventStorage.getActiveEventId();
    if (targetId) storageAdapter.set(`${PREFIX}${targetId}`, winners);
  },

  publishWinners: (eventId, unPublishedWinners) => {
    let targetId = eventId;
    let winnersList = unPublishedWinners;

    if (Array.isArray(eventId)) {
      targetId = eventStorage.getActiveEventId();
      winnersList = eventId;
    }

    if (!targetId) return [];

    const published = (winnersList || []).map(w => ({ ...w, published: true }));
    storageAdapter.set(`${PREFIX}${targetId}`, published);
    return published;
  },

  resetWinners: (eventId) => {
    const targetId = eventId || eventStorage.getActiveEventId();
    if (targetId) {
      storageAdapter.set(`${PREFIX}${targetId}`, []);
    }
    return [];
  }
};
