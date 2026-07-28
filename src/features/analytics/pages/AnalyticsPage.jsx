import React from 'react';
import { useEvent } from '../../../context/EventContext';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage = () => {
  const { registrations } = useEvent();
  const reservedCount = registrations.length;
  const remainingCount = 1000 - reservedCount;

  const hourlyData = [
    { time: '09:00', count: 2 },
    { time: '10:00', count: 4 },
    { time: '11:00', count: 7 },
    { time: '12:00', count: 12 },
    { time: '13:00', count: 18 },
    { time: '14:00', count: reservedCount }
  ];

  const pieData = [
    { name: 'Reserved Invoices', value: reservedCount, color: '#2563eb' },
    { name: 'Available Invoices', value: remainingCount, color: '#cbd5e1' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900 flex items-center gap-2">
          <BarChart3 size={26} className="text-blue-600" /> Event Analytics & Insights
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Real-time analytics for registration velocity, invoice occupancy, and draw timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-blue-900 mb-4">Hourly Registration Velocity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-blue-900 mb-4">Invoice Occupancy Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={4} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
