export const DEFAULT_PRIZE_IMAGES = {
  washingMachine: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="180" x="10" y="10" rx="16" fill="%23f0f4f8" stroke="%23cbd5e1" stroke-width="4"/><rect width="140" height="30" x="30" y="25" rx="6" fill="%23e2e8f0"/><circle cx="50" cy="40" r="6" fill="%232563eb"/><circle cx="70" cy="40" r="4" fill="%2394a3b8"/><circle cx="85" cy="40" r="4" fill="%2394a3b8"/><rect width="40" height="16" x="115" y="32" rx="4" fill="%231e293b"/><circle cx="100" cy="115" r="50" fill="%23cbd5e1" stroke="%2364748b" stroke-width="6"/><circle cx="100" cy="115" r="38" fill="%2338bdf8" opacity="0.6"/><path d="M 70 120 Q 90 100 110 120 T 130 120" fill="none" stroke="%23ffffff" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="75" r="8" fill="%23cbd5e1"/></svg>`,
  mixerGrinder: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="180" x="10" y="10" rx="16" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4"/><path d="M 65 140 L 75 80 L 125 80 L 135 140 Z" fill="%230ea5e9" stroke="%230284c7" stroke-width="3"/><rect width="70" height="14" x="65" y="70" rx="3" fill="%23334155"/><rect width="12" height="40" x="130" y="90" rx="4" fill="%230ea5e9" stroke="%230284c7" stroke-width="2"/><rect width="80" height="35" x="60" y="135" rx="8" fill="%23f1f5f9" stroke="%2394a3b8" stroke-width="3"/><circle cx="100" cy="152" r="7" fill="%23ef4444"/><circle cx="120" cy="152" r="4" fill="%233b82f6"/></svg>`,
  microOven: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="140" x="10" y="30" rx="14" fill="%231e293b" stroke="%23475569" stroke-width="4"/><rect width="115" height="95" x="25" y="52" rx="8" fill="%230f172a" stroke="%23334155" stroke-width="3"/><rect width="105" height="85" x="30" y="57" rx="6" fill="%23f59e0b" opacity="0.15"/><path d="M 40 100 Q 80 80 120 100" fill="none" stroke="%23f59e0b" stroke-width="3"/><rect width="32" height="95" x="148" y="52" rx="6" fill="%23334155"/><rect width="24" height="14" x="152" y="60" rx="2" fill="%2322c55e"/><text x="164" y="71" fill="%23ffffff" font-size="10" font-family="monospace" text-anchor="middle">12:00</text><circle cx="164" cy="95" r="8" fill="%2364748b"/><circle cx="164" cy="122" r="8" fill="%2364748b"/></svg>`,
  induction: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="170" height="150" x="15" y="25" rx="12" fill="%230f172a" stroke="%23334155" stroke-width="4"/><circle cx="100" cy="85" r="45" fill="none" stroke="%23ef4444" stroke-width="3" stroke-dasharray="6,4"/><circle cx="100" cy="85" r="30" fill="none" stroke="%23f97316" stroke-width="2"/><rect width="140" height="30" x="30" y="135" rx="6" fill="%231e293b"/><text x="100" y="154" fill="%23ef4444" font-size="12" font-family="monospace" text-anchor="middle">HOT - 1200W</text><circle cx="45" cy="150" r="4" fill="%2322c55e"/><circle cx="155" cy="150" r="4" fill="%233b82f6"/></svg>`,
  sandwichMaker: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><path d="M 25 110 L 175 110 L 160 155 C 160 162 150 168 140 168 L 60 168 C 50 168 40 162 40 155 Z" fill="%231e293b" stroke="%23475569" stroke-width="3"/><path d="M 25 110 L 175 110 L 155 55 C 150 48 135 42 100 42 C 65 42 50 48 45 55 Z" fill="%236b21a8" stroke="%23581c87" stroke-width="3"/><rect width="40" height="12" x="80" y="70" rx="4" fill="%23e2e8f0"/><circle cx="90" cy="76" r="3" fill="%23ef4444"/><circle cx="110" cy="76" r="3" fill="%2322c55e"/><rect width="50" height="10" x="75" y="105" rx="3" fill="%23334155"/></svg>`
};

export const INITIAL_EVENT = null;

export const INITIAL_PRIZES = [
  {
    rank: 1,
    name: "WASHING MACHINE",
    image: DEFAULT_PRIZE_IMAGES.washingMachine,
    description: "Front-load Automatic 7Kg Washer",
    colorTheme: "#0052cc",
    animation: "spotlight",
    winnerBadge: "🥇",
    winnerId: null
  },
  {
    rank: 2,
    name: "MIXTURE GRINDER",
    image: DEFAULT_PRIZE_IMAGES.mixerGrinder,
    description: "750W Heavy Duty 4-Jar Mixer",
    colorTheme: "#00875a",
    animation: "glow",
    winnerBadge: "🥈",
    winnerId: null
  },
  {
    rank: 3,
    name: "MICRO OVEN",
    image: DEFAULT_PRIZE_IMAGES.microOven,
    description: "28L Convection Microwave",
    colorTheme: "#ff8b00",
    animation: "bounce",
    winnerBadge: "🥉",
    winnerId: null
  },
  {
    rank: 4,
    name: "INDUCTION",
    image: DEFAULT_PRIZE_IMAGES.induction,
    description: "2000W Smart Touch Induction Cooktop",
    colorTheme: "#de350b",
    animation: "pulse",
    winnerBadge: "4th",
    winnerId: null
  },
  {
    rank: 5,
    name: "SANDWICH MAKER",
    image: DEFAULT_PRIZE_IMAGES.sandwichMaker,
    description: "Non-stick Grill Sandwich Toaster",
    colorTheme: "#5243aa",
    animation: "float",
    winnerBadge: "5th",
    winnerId: null
  }
];

export const INITIAL_PARTICIPANTS = [];

export const INITIAL_WINNER_HISTORY = [];
