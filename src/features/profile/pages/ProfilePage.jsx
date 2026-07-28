import React from 'react';
import { useAuthStore } from '../../auth/authStore';
import { useEvent } from '../../../context/EventContext';
import { User, ShieldCheck, Mail, Phone, RefreshCw } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { resetToDefaults } = useEvent();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <User size={26} className="text-blue-600" /> Account & Profile Settings
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Manage your account profile details, security preferences, and system state.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 max-w-xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-950 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{user?.name || 'User'}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 mt-1">
              <ShieldCheck size={14} /> {user?.role === 'admin' ? 'Administrator' : 'Participant User'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Mail size={14} /> Email Address
            </span>
            <span className="text-sm font-extrabold text-slate-800">{user?.email || 'user@botivate.com'}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Phone size={14} /> Phone Number
            </span>
            <span className="text-sm font-extrabold text-slate-800">{user?.phone || '+91 98765 43210'}</span>
          </div>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-black text-red-700">Reset Application Demo Data</h3>
            <p className="text-xs font-medium text-red-600 mt-0.5">Restores default initial event, 5 rank prizes, and registered participants.</p>
          </div>

          <Button 
            variant="danger" 
            icon={RefreshCw}
            onClick={() => {
              if (window.confirm("Reset all system data back to initial seed data?")) {
                resetToDefaults();
                alert("Demo data reset successfully.");
              }
            }}
          >
            Reset System Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
};
