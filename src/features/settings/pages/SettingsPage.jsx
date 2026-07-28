import React, { useState } from 'react';
import { useEvent } from '../../../context/EventContext';
import { Settings, Palette, Sliders, Check, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const { eventData, updateEventDetails, addNotification } = useEvent();

  const [theme, setTheme] = useState(eventData.settings?.theme || 'light');
  const [confettiEnabled, setConfettiEnabled] = useState(eventData.settings?.confettiEnabled ?? true);
  const [autoPublish, setAutoPublish] = useState(eventData.settings?.autoPublish ?? false);

  // Dynamic live theme application on change (silent)
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle Confetti Rule & Instantly Save
  const toggleConfetti = (val) => {
    const next = typeof val === 'boolean' ? val : !confettiEnabled;
    setConfettiEnabled(next);
    updateEventDetails({
      settings: {
        ...eventData.settings,
        theme,
        confettiEnabled: next,
        autoPublish
      }
    });
    if (next) {
      toast.success('Victory Confetti Fireworks Animation enabled!');
    } else {
      toast.info('Victory Confetti Fireworks Animation disabled.');
    }
  };

  // Toggle Auto-Publish Rule & Instantly Save
  const toggleAutoPublish = (val) => {
    const next = typeof val === 'boolean' ? val : !autoPublish;
    setAutoPublish(next);
    updateEventDetails({
      settings: {
        ...eventData.settings,
        theme,
        confettiEnabled,
        autoPublish: next
      }
    });
    if (next) {
      toast.success('Auto-Publish Rule activated! Winners will be published live instantly upon draw.');
    } else {
      toast.info('Manual Review mode active. Winners require manual publishing after draw.');
    }
  };

  const handleTestConfetti = (e) => {
    e.stopPropagation();
    if (!confettiEnabled) {
      toast.warning('Confetti is disabled. Enabling confetti and launching test!');
      toggleConfetti(true);
    }
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();

    // Mutate Event State in Context & LocalStorage
    updateEventDetails({
      settings: {
        ...eventData.settings,
        theme,
        confettiEnabled,
        autoPublish
      }
    });

    // Apply Theme to DOM
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Log Activity Notification
    if (addNotification) {
      addNotification(`System settings saved: Theme (${theme.toUpperCase()}), Confetti (${confettiEnabled ? 'ON' : 'OFF'}), Auto-Publish (${autoPublish ? 'ON' : 'OFF'})`);
    }

    toast.success('All System Settings saved and applied successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <Settings size={26} className="text-blue-600" /> System Settings
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Configure live theme preferences, draw behavior rules, auto-publish settings, and system defaults.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl">
        {/* Theme & Palette Section */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
            <Palette size={18} className="text-blue-600" /> Theme & Appearance
          </h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Application Theme Palette</label>
            <select 
              value={theme} 
              onChange={(e) => handleThemeChange(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all bg-white cursor-pointer"
            >
              <option value="light">Corporate Blue (Light Mode - Default)</option>
              <option value="dark">Dark Mode</option>
              <option value="luxury">Luxury Gold</option>
              <option value="festival">Festival Celebration</option>
            </select>
          </div>
        </div>

        {/* Draw Rules Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
            <Sliders size={18} className="text-blue-600" /> Draw Engine Rules
          </h3>

          {/* Rule 1: Confetti Animation */}
          <div 
            className={`p-4 border rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer select-none ${
              confettiEnabled ? 'bg-blue-50/70 border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
            }`}
            onClick={() => toggleConfetti()}
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={confettiEnabled} 
                onChange={(e) => toggleConfetti(e.target.checked)} 
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 accent-blue-900 rounded-md cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-800">Enable Victory Confetti Fireworks Animation</span>
            </div>

            <button
              type="button"
              className="px-3.5 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-950 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
              onClick={handleTestConfetti}
            >
              <Sparkles size={14} className="text-amber-400" /> Test Animation
            </button>
          </div>

          {/* Rule 2: Auto-Publish Winners */}
          <div 
            className={`p-4 border rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer select-none ${
              autoPublish ? 'bg-emerald-50/70 border-emerald-200 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
            }`}
            onClick={() => toggleAutoPublish()}
          >
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={autoPublish} 
                onChange={(e) => toggleAutoPublish(e.target.checked)} 
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 accent-blue-900 rounded-md cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-800">Auto-Publish Winners Immediately After Draw</span>
            </div>

            <button
              type="button"
              className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer active:scale-95 ${
                autoPublish 
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                  : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleAutoPublish();
              }}
            >
              {autoPublish ? 'RULE ACTIVE' : 'MANUAL REVIEW'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-start">
          <Button type="submit" variant="primary" icon={Check}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
