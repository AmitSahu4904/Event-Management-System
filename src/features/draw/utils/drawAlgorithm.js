/**
 * Pure sequential 5-winner draw algorithm.
 * 
 * Rules:
 * 1. Only registered participants can win.
 * 2. Each participant can win ONLY ONCE across all 5 ranks.
 * 3. Selection is 100% random.
 * 4. Rank 1 is drawn first, then winner is removed from eligible pool.
 * 5. Rank 2 draws from remaining, continuing through Rank 5.
 * 6. If eligible participants count < 5, draws as many ranks as possible.
 * 
 * @param {Array} participants - Array of all registered participants { id, invoiceNo, name, phone, timestamp }
 * @param {Array} existingWinners - Array of already published/locked winner objects to exclude
 * @returns {Array} Array of winner objects for ranks 1-5 { rank, participantId, invoiceNo, name, phone, drawTime, published }
 */
export function drawSequentialWinners(participants = [], existingWinners = []) {
  const excludedIds = new Set(existingWinners.map(w => w.participantId || w.id));

  // Eligible pool of participants who haven't won yet
  let eligiblePool = participants.filter(p => !excludedIds.has(p.id));

  const drawnWinners = [];

  for (let rank = 1; rank <= 5; rank++) {
    if (eligiblePool.length === 0) {
      break; // No more eligible participants
    }

    // Pick random index from remaining pool
    const randomIndex = Math.floor(Math.random() * eligiblePool.length);
    const selectedParticipant = eligiblePool[randomIndex];

    const winnerObj = {
      rank,
      participantId: selectedParticipant.id,
      invoiceNo: selectedParticipant.invoiceNo,
      name: selectedParticipant.name,
      phone: selectedParticipant.phone,
      drawTime: new Date().toISOString(),
      published: false
    };

    drawnWinners.push(winnerObj);

    // Remove winner from eligible pool for remaining rank draws
    eligiblePool = eligiblePool.filter(p => p.id !== selectedParticipant.id);
  }

  return drawnWinners;
}

/**
 * Draws a single winner for a specific rank (useful for single-rank redraw before publish).
 */
export function redrawSingleRank(rank, participants = [], otherRankWinners = []) {
  const excludedIds = new Set(otherRankWinners.map(w => w.participantId));
  const eligiblePool = participants.filter(p => !excludedIds.has(p.id));

  if (eligiblePool.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * eligiblePool.length);
  const selected = eligiblePool[randomIndex];

  return {
    rank,
    participantId: selected.id,
    invoiceNo: selected.invoiceNo,
    name: selected.name,
    phone: selected.phone,
    drawTime: new Date().toISOString(),
    published: false
  };
}
