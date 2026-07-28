import { create } from 'zustand';
import { winnerStorage } from '../../services/winnerStorage';
import { drawSequentialWinners, redrawSingleRank } from '../../utils/drawAlgorithm';
import { useRegistrationStore } from '../registration/registrationStore';
import { usePrizesStore } from '../prizes/prizesStore';

export const DRAW_STATES = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  RANDOMIZING: 'RANDOMIZING',
  DRAWING: 'DRAWING',
  WINNER_SELECTED: 'WINNER_SELECTED',
  PUBLISHED: 'PUBLISHED'
};

export const useDrawStore = create((set, get) => ({
  winners: winnerStorage.getWinners(),
  currentDraftWinners: [], // Draft winners drawn but not published yet
  drawState: DRAW_STATES.IDLE,
  currentDrawingRank: 1, // 1 to 5

  setDrawState: (state) => set({ drawState: state }),

  // Perform sequential 5-winner draw from registered participants
  drawAllFiveWinners: () => {
    const participants = useRegistrationStore.getState().participants;
    if (participants.length === 0) {
      return { success: false, message: "No registered participants available to draw!" };
    }

    set({ drawState: DRAW_STATES.PREPARING });

    // Execute 5-winner draw logic
    const draftWinners = drawSequentialWinners(participants, []);
    set({ currentDraftWinners: draftWinners, currentDrawingRank: 1, drawState: DRAW_STATES.RANDOMIZING });

    return { success: true, count: draftWinners.length, winners: draftWinners };
  },

  // Single rank redraw (only before publishing)
  redrawRank: (rank) => {
    const participants = useRegistrationStore.getState().participants;
    const currentDrafts = get().currentDraftWinners;
    const otherRankWinners = currentDrafts.filter(w => w.rank !== rank);

    const newRankWinner = redrawSingleRank(rank, participants, otherRankWinners);
    if (!newRankWinner) {
      return { success: false, message: "No eligible participant available for redraw!" };
    }

    const updatedDrafts = currentDrafts.map(w => w.rank === rank ? newRankWinner : w);
    set({ currentDraftWinners: updatedDrafts });
    return { success: true, winner: newRankWinner };
  },

  // Finalize & Publish Winners (Permanently store)
  publishWinners: () => {
    const drafts = get().currentDraftWinners;
    if (drafts.length === 0) return { success: false, message: "No winners drawn to publish." };

    const published = winnerStorage.publishWinners(drafts);
    set({ winners: published, drawState: DRAW_STATES.PUBLISHED });

    // Sync winnerIds to prize store for Ranks 1 to 5
    const prizesStore = usePrizesStore.getState();
    published.forEach(w => {
      prizesStore.updatePrizeWinner(w.rank, w.participantId);
    });

    return { success: true, published };
  },

  resetWinners: () => {
    const winners = winnerStorage.resetWinners();
    set({ winners, currentDraftWinners: [], drawState: DRAW_STATES.IDLE });
  }
}));
