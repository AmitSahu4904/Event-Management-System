// Default high quality sample images as SVG data URLs for instant offline crisp display
export const DEFAULT_PRIZE_IMAGES = {
  washingMachine: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="180" x="10" y="10" rx="16" fill="%23f0f4f8" stroke="%23cbd5e1" stroke-width="4"/><rect width="140" height="30" x="30" y="25" rx="6" fill="%23e2e8f0"/><circle cx="50" cy="40" r="6" fill="%232563eb"/><circle cx="70" cy="40" r="4" fill="%2394a3b8"/><circle cx="85" cy="40" r="4" fill="%2394a3b8"/><rect width="40" height="16" x="115" y="32" rx="4" fill="%231e293b"/><circle cx="100" cy="115" r="50" fill="%23cbd5e1" stroke="%2364748b" stroke-width="6"/><circle cx="100" cy="115" r="38" fill="%2338bdf8" opacity="0.6"/><path d="M 70 120 Q 90 100 110 120 T 130 120" fill="none" stroke="%23ffffff" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="75" r="8" fill="%23cbd5e1"/></svg>`,
  mixerGrinder: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="180" x="10" y="10" rx="16" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4"/><path d="M 65 140 L 75 80 L 125 80 L 135 140 Z" fill="%230ea5e9" stroke="%230284c7" stroke-width="3"/><rect width="70" height="14" x="65" y="70" rx="3" fill="%23334155"/><rect width="12" height="40" x="130" y="90" rx="4" fill="%230ea5e9" stroke="%230284c7" stroke-width="2"/><rect width="80" height="35" x="60" y="135" rx="8" fill="%23f1f5f9" stroke="%2394a3b8" stroke-width="3"/><circle cx="100" cy="152" r="7" fill="%23ef4444"/><circle cx="120" cy="152" r="4" fill="%233b82f6"/></svg>`,
  microOven: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="180" height="140" x="10" y="30" rx="14" fill="%231e293b" stroke="%23475569" stroke-width="4"/><rect width="115" height="95" x="25" y="52" rx="8" fill="%230f172a" stroke="%23334155" stroke-width="3"/><rect width="105" height="85" x="30" y="57" rx="6" fill="%23f59e0b" opacity="0.15"/><path d="M 40 100 Q 80 80 120 100" fill="none" stroke="%23f59e0b" stroke-width="3"/><rect width="32" height="95" x="148" y="52" rx="6" fill="%23334155"/><rect width="24" height="14" x="152" y="60" rx="2" fill="%2322c55e"/><text x="164" y="71" fill="%23ffffff" font-size="10" font-family="monospace" text-anchor="middle">12:00</text><circle cx="164" cy="95" r="8" fill="%2364748b"/><circle cx="164" cy="122" r="8" fill="%2364748b"/></svg>`,
  induction: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="170" height="150" x="15" y="25" rx="12" fill="%230f172a" stroke="%23334155" stroke-width="4"/><circle cx="100" cy="85" r="45" fill="none" stroke="%23ef4444" stroke-width="3" stroke-dasharray="6,4"/><circle cx="100" cy="85" r="30" fill="none" stroke="%23f97316" stroke-width="2"/><rect width="140" height="30" x="30" y="135" rx="6" fill="%231e293b"/><text x="100" y="154" fill="%23ef4444" font-size="12" font-family="monospace" text-anchor="middle">HOT - 1200W</text><circle cx="45" cy="150" r="4" fill="%2322c55e"/><circle cx="155" cy="150" r="4" fill="%233b82f6"/></svg>`,
  sandwichMaker: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><path d="M 25 110 L 175 110 L 160 155 C 160 162 150 168 140 168 L 60 168 C 50 168 40 162 40 155 Z" fill="%231e293b" stroke="%23475569" stroke-width="3"/><path d="M 25 110 L 175 110 L 155 55 C 150 48 135 42 100 42 C 65 42 50 48 45 55 Z" fill="%236b21a8" stroke="%23581c87" stroke-width="3"/><rect width="40" height="12" x="80" y="70" rx="4" fill="%23e2e8f0"/><circle cx="90" cy="76" r="3" fill="%23ef4444"/><circle cx="110" cy="76" r="3" fill="%2322c55e"/><rect width="50" height="10" x="75" y="105" rx="3" fill="%23334155"/></svg>`
};

export const INITIAL_EVENT_DATA = {
  id: "evt_divine_2025",
  name: "DIVINE EMPIRE INDIA",
  startDate: "2025-05-28T09:00",
  endDate: "2025-05-28T18:00",
  isLive: true,
  manualViewerCount: 356, // fallback if user wants manual or added to real registration count
  prizes: [
    { rank: 1, name: "WASHING MACHINE", image: DEFAULT_PRIZE_IMAGES.washingMachine, color: "#0284c7" },
    { rank: 2, name: "MIXTURE GRINDER", image: DEFAULT_PRIZE_IMAGES.mixerGrinder, color: "#16a34a" },
    { rank: 3, name: "MICRO OVEN", image: DEFAULT_PRIZE_IMAGES.microOven, color: "#ea580c" },
    { rank: 4, name: "INDUCTION", image: DEFAULT_PRIZE_IMAGES.induction, color: "#e11d48" },
    { rank: 5, name: "SANDWICH MAKER", image: DEFAULT_PRIZE_IMAGES.sandwichMaker, color: "#4f46e5" }
  ],
  winner: {
    invoiceNo: "987",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    drawTime: "28 May 2025, 11:45 AM"
  }
};

// Seed initial registrations (000 - 999 range)
export const DUMMY_REGISTRATIONS = [
  { invoiceNo: "987", name: "Rahul Sharma", phone: "9876543210", timestamp: "2025-05-28T11:40:00" },
  { invoiceNo: "001", name: "Priya Patel", phone: "9812345678", timestamp: "2025-05-28T09:15:00" },
  { invoiceNo: "042", name: "Amit Kumar", phone: "9988776655", timestamp: "2025-05-28T09:30:00" },
  { invoiceNo: "123", name: "Sunita Verma", phone: "9711223344", timestamp: "2025-05-28T10:05:00" },
  { invoiceNo: "555", name: "Vikram Singh", phone: "9822334455", timestamp: "2025-05-28T10:20:00" },
  { invoiceNo: "777", name: "Ananya Roy", phone: "9933445566", timestamp: "2025-05-28T11:00:00" },
  { invoiceNo: "888", name: "Rohan Gupta", phone: "9644556677", timestamp: "2025-05-28T11:15:00" },
  { invoiceNo: "250", name: "Neha Joshi", phone: "9555667788", timestamp: "2025-05-28T11:25:00" },
  { invoiceNo: "333", name: "Deepak Yadav", phone: "9466778899", timestamp: "2025-05-28T11:30:00" },
  { invoiceNo: "412", name: "Kavita Rao", phone: "9377889900", timestamp: "2025-05-28T11:35:00" }
];
