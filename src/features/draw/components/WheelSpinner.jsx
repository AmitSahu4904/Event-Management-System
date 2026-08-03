import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, Trophy, RotateCw, Volume2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const WHEEL_COLORS = [
  '#1e3a8a', // blue-900
  '#f59e0b', // amber-500
  '#0284c7', // sky-600
  '#7e22ce', // purple-700
  '#059669', // emerald-600
  '#e11d48', // rose-600
  '#0f766e', // teal-700
  '#d97706'  // amber-600
];

export const WheelSpinner = ({ 
  participants = [], 
  activeRank = 1, 
  prizeName = 'Grand Prize', 
  existingWinners = [], 
  onSpinEnd 
}) => {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const currentRotationRef = useRef(0);

  // Filter out participants who have already won
  const winningInvoices = new Set(existingWinners.map(w => w.invoiceNo));
  const eligibleParticipants = participants.filter(p => !winningInvoices.has(p.invoiceNo));

  // Determine display slices (up to 12 visible slices on wheel)
  const sliceCount = Math.max(6, Math.min(12, eligibleParticipants.length || 6));
  
  const displaySlices = React.useMemo(() => {
    if (eligibleParticipants.length === 0) {
      return Array.from({ length: 6 }, (_, i) => ({
        invoiceNo: `00${i + 1}`,
        name: `Client ${i + 1}`
      }));
    }
    
    // Take evenly spaced sample or top N items
    if (eligibleParticipants.length <= 12) {
      return eligibleParticipants;
    }
    const step = eligibleParticipants.length / 12;
    return Array.from({ length: 12 }, (_, i) => eligibleParticipants[Math.floor(i * step)]);
  }, [eligibleParticipants]);

  const sliceAngle = 360 / displaySlices.length;

  const handleSpin = async () => {
    if (isSpinning) return;
    if (eligibleParticipants.length === 0) {
      alert('No eligible participants available to spin for this draw!');
      return;
    }

    setIsSpinning(true);
    setSelectedWinner(null);
    setShowWinnerModal(false);

    // Randomly pick winning participant from eligible list
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const winner = eligibleParticipants[randomIndex];

    // Find closest index on visual display slices for rotation calculation
    let sliceIndex = displaySlices.findIndex(s => s.invoiceNo === winner.invoiceNo);
    if (sliceIndex === -1) {
      sliceIndex = randomIndex % displaySlices.length;
    }

    // Target angle calculation (align slice to top pointer at 0 deg)
    const targetSliceCenter = (sliceIndex * sliceAngle) + (sliceAngle / 2);
    const spins = 6 * 360; // 6 full 360 rotations
    const finalAngle = currentRotationRef.current + spins + (360 - targetSliceCenter);
    currentRotationRef.current = finalAngle;

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 4.5,
        ease: [0.15, 0.85, 0.35, 1.0] // smooth decelerating spin curve
      }
    });

    setIsSpinning(false);
    setSelectedWinner(winner);
    setShowWinnerModal(true);

    // Fire celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (onSpinEnd) {
      onSpinEnd(winner);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-xl mx-auto my-4">
      {/* Target Prize Rank Header */}
      <div className="bg-blue-950 text-white border-2 border-amber-400/40 rounded-2xl px-6 py-2.5 text-center shadow-lg flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-400 text-blue-950 font-black text-sm flex items-center justify-center shadow-xs">
          R{activeRank}
        </div>
        <div className="text-left leading-tight">
          <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">SPINNING FOR RANK {activeRank} REWARD</span>
          <span className="text-sm font-black text-white">{prizeName}</span>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
        
        {/* Top Pointer Needle */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-6 h-8 bg-gradient-to-b from-amber-300 to-amber-500 clip-triangle shadow-lg border-x-2 border-amber-200"></div>
          <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md -mt-2"></div>
        </div>

        {/* Outer Wheel Ring Glow */}
        <div className="absolute inset-0 rounded-full border-8 border-blue-900/40 shadow-2xl bg-gradient-to-b from-blue-950 to-slate-950 p-2"></div>

        {/* Rotating Wheel Graphics */}
        <motion.div 
          animate={controls}
          className="w-full h-full rounded-full relative overflow-hidden shadow-inner border-4 border-amber-400/60"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {displaySlices.map((item, idx) => {
              const startAngle = idx * sliceAngle;
              const endAngle = (idx + 1) * sliceAngle;
              
              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
              
              const largeArcFlag = sliceAngle > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              const color = WHEEL_COLORS[idx % WHEEL_COLORS.length];

              const midAngle = startAngle + sliceAngle / 2;
              const textRad = (Math.PI * midAngle) / 180;
              const textX = 50 + 34 * Math.cos(textRad);
              const textY = 50 + 34 * Math.sin(textRad);

              return (
                <g key={idx}>
                  <path d={pathData} fill={color} stroke="#0f172a" strokeWidth="0.6" />
                  <text
                    x={textX}
                    y={textY}
                    fill="#ffffff"
                    fontSize="3.5"
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    className="select-none font-mono drop-shadow-sm"
                  >
                    #{item.invoiceNo}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Hub & Spin Button */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning || eligibleParticipants.length === 0}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-blue-950 font-black text-xs sm:text-sm flex flex-col items-center justify-center shadow-2xl border-4 border-white z-20 cursor-pointer active:scale-95 transition-all ${
            isSpinning ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105 hover:brightness-110 ring-4 ring-amber-400/40'
          }`}
        >
          <RotateCw size={22} className={`mb-1 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}</span>
        </button>
      </div>

      {/* Eligible Participants Counter */}
      <div className="text-center text-xs font-bold text-slate-500">
        Eligible Participants Pool: <strong className="text-blue-900">{eligibleParticipants.length} Client Invoices</strong>
      </div>

      {/* Winner Spotlight Modal */}
      {showWinnerModal && selectedWinner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-blue-950 flex items-center justify-center mx-auto shadow-lg">
              <Trophy size={36} />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                🎉 RANK {activeRank} WINNER REVEALED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-900 mt-3">
                {selectedWinner.name}
              </h3>
              <p className="text-sm font-extrabold text-slate-600 mt-1">
                Invoice: <strong className="text-blue-900 font-mono text-base">#{selectedWinner.invoiceNo}</strong>
              </p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Phone: <strong className="text-slate-700">{selectedWinner.phone}</strong>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs font-bold text-blue-900">
              Reward: <strong className="text-amber-600 text-sm">{prizeName}</strong>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
              onClick={() => setShowWinnerModal(false)}
            >
              <CheckCircle2 size={16} /> Confirm & Publish Winner
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
