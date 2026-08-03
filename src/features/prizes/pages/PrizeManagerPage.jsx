import React from 'react';
import { useEvent } from '../../../context/EventContext';
import { Gift } from 'lucide-react';
import { PrizeManagementSection } from '../../../pages/admin/PrizeManagementSection';
import { toast } from 'sonner';

export const PrizeManagerPage = () => {
  const { prizes, updatePrizeRank } = useEvent();

  const handleImageUpload = (rank, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const currentPrize = prizes.find(p => p.rank === rank);
      updatePrizeRank(rank, currentPrize?.name || `Rank ${rank} Prize`, base64Image);
      toast.success(`Rank ${rank} prize image updated!`);
    };
    reader.readAsDataURL(file);
  };

  const handlePrizeNameChange = (rank, name) => {
    const currentPrize = prizes.find(p => p.rank === rank);
    updatePrizeRank(rank, name, currentPrize?.image);
    toast.success(`Rank ${rank} prize name updated!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <Gift size={26} className="text-blue-600" /> Prize Manager ({prizes?.length || 5} Ranks)
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Set up prize names and upload images for Rank 1 (Highest) through Rank {prizes?.length || 5} (Lowest).
        </p>
      </div>

      <PrizeManagementSection
        prizes={prizes}
        onImageUpload={handleImageUpload}
        onPrizeNameChange={handlePrizeNameChange}
      />
    </div>
  );
};
