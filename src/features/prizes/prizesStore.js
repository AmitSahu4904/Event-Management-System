import { create } from 'zustand';
import { eventStorage } from '../../services/eventStorage';

export const usePrizesStore = create((set, get) => ({
  prizes: eventStorage.getPrizes(),

  updatePrize: (rank, updatedFields) => {
    const updated = get().prizes.map(p => {
      if (p.rank === rank) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    eventStorage.savePrizes(updated);
    set({ prizes: updated });
  },

  updatePrizeWinner: (rank, winnerId) => {
    const updated = get().prizes.map(p => {
      if (p.rank === rank) {
        return { ...p, winnerId };
      }
      return p;
    });
    eventStorage.savePrizes(updated);
    set({ prizes: updated });
  },

  resetPrizes: () => {
    const prizes = eventStorage.getPrizes();
    set({ prizes });
  }
}));
