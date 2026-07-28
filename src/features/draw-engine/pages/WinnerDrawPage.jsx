import React, { useState } from 'react';
import { useEvent } from '../../../context/EventContext';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WinnerDrawSection } from '../../../pages/admin/WinnerDrawSection';
import { toast } from 'sonner';

export const WinnerDrawPage = () => {
  const { 
    eventData,
    winners, 
    currentDraftWinners, 
    realParticipantCount, 
    drawAllFiveWinners, 
    redrawRank, 
    publishWinners 
  } = useEvent();

  const [drawResultNotice, setDrawResultNotice] = useState('');

  const confettiEnabled = eventData?.settings?.confettiEnabled ?? true;
  const autoPublish = eventData?.settings?.autoPublish ?? false;

  const handleDrawAllWinners = () => {
    const res = drawAllFiveWinners();
    if (!res.success) {
      setDrawResultNotice(res.message);
      toast.error(res.message);
    } else {
      let msg = `Successfully drawn ${res.count} draft winners for Ranks 1 to 5! Review below before publishing.`;
      
      // Auto-publish rule check
      if (autoPublish) {
        publishWinners();
        msg = `Successfully drawn & auto-published 5 winners live!`;
        toast.success('5 Winners drawn & published live automatically!');
      } else {
        toast.success('All 5 Winners drawn successfully!');
      }

      setDrawResultNotice(msg);

      // Confetti rule check
      if (confettiEnabled) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleRedrawRank = (rank) => {
    const res = redrawRank(rank);
    if (!res.success) {
      setDrawResultNotice(res.message);
      toast.error(res.message);
    } else {
      const msg = `Rank ${rank} winner redrawn: Invoice #${res.winner.invoiceNo} (${res.winner.name})`;
      setDrawResultNotice(msg);
      toast.info(`Rank ${rank} redrawn: #${res.winner.invoiceNo} ${res.winner.name}`);

      if (autoPublish) {
        publishWinners();
      }
    }
  };

  const handlePublishWinners = () => {
    const res = publishWinners();
    if (res.success) {
      setDrawResultNotice('Winners published permanently to Live Display & Winner History!');
      toast.success('Winners published live to all participants!');
      
      if (confettiEnabled) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <Trophy size={26} className="text-amber-500" /> Sequential 5-Winner Draw Engine
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Execute random winner selection across 5 ranks with single-rank redraw and publish controls.
        </p>
      </div>

      <WinnerDrawSection
        winners={winners}
        currentDraftWinners={currentDraftWinners}
        realParticipantCount={realParticipantCount}
        onDrawAllWinners={handleDrawAllWinners}
        onRedrawRank={handleRedrawRank}
        onPublishWinners={handlePublishWinners}
        drawResultNotice={drawResultNotice}
      />
    </div>
  );
};
