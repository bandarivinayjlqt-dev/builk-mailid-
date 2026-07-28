import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Eye,
  MousePointerClick,
  Smartphone,
  Globe,
  Share2,
  FileSpreadsheet
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { campaigns } = useApp();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || 'cmp_201');

  const campaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const deviceData = [
    { name: 'Desktop (Chrome/Outlook)', value: 58, color: '#4f46e5' },
    { name: 'Mobile (Apple Mail/Gmail)', value: 34, color: '#0284c7' },
    { name: 'Tablet (iPadOS)', value: 8, color: '#10b981' },
  ];

  const hourlyData = [
    { hour: '08:00', opens: 140, clicks: 42 },
    { hour: '10:00', opens: 320, clicks: 110 },
    { hour: '12:00', opens: 450, clicks: 180 },
    { hour: '14:00', opens: 280, clicks: 95 },
    { hour: '16:00', opens: 180, clicks: 55 },
  ];

  const geoData = [
    { country: 'United States', code: 'US', opens: 950, pct: '44%' },
    { country: 'United Kingdom', code: 'GB', opens: 380, pct: '18%' },
    { country: 'Germany', code: 'DE', opens: 260, pct: '12%' },
    { country: 'India', code: 'IN', opens: 240, pct: '11%' },
    { country: 'Canada', code: 'CA', opens: 180, pct: '8%' },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Total Recipients,${campaign?.totalRecipients}\n`
      + `Delivered,${campaign?.deliveredCount}\n`
      + `Opens,${campaign?.opensCount}\n`
      + `Clicks,${campaign?.clicksCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Campaign_Report_${campaign?.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            <span>Campaign Analytics & Performance Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time open tracking, click-through heatmaps, device breakdowns, and CSV export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Campaign Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Active Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={e => setSelectedCampaignId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 outline-none"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 text-xs">
          Sent on {campaign?.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 'Active Dispatch'}
        </div>
      </div>

      {/* Stat Summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Total Recipients</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {campaign?.totalRecipients.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">100% Target Reached</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Unique Opens</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {campaign?.uniqueOpensCount.toLocaleString()} ({campaign?.deliveredCount ? ((campaign.opensCount / campaign.deliveredCount) * 100).toFixed(1) : 0}%)
          </div>
          <div className="text-[10px] text-sky-500 font-medium">Above Industry Average</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Unique Clicks</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {campaign?.uniqueClicksCount.toLocaleString()} ({campaign?.deliveredCount ? ((campaign.clicksCount / campaign.deliveredCount) * 100).toFixed(1) : 0}%)
          </div>
          <div className="text-[10px] text-purple-500 font-medium">High CTR Engagement</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">Bounces & Unsubscribes</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {(campaign?.bounceCount || 0) + (campaign?.unsubscribeCount || 0)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">0.12% Low Opt-out</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Engagement Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Hourly Open & Click Velocity
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="opens" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Opens" />
                <Bar dataKey="clicks" fill="#0284c7" radius={[6, 6, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown Pie Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span>Device Distribution</span>
          </h2>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {deviceData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Country Distribution Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>Top Geographic Open Distribution</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                <th className="pb-3 px-2">Country</th>
                <th className="pb-3 px-2">Opens</th>
                <th className="pb-3 px-2">Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {geoData.map(g => (
                <tr key={g.country}>
                  <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200">
                    {g.country}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-slate-400">
                    {g.opens}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-indigo-600 dark:text-indigo-400">
                    {g.pct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
