import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  MailCheck,
  Eye,
  MousePointerClick,
  AlertTriangle,
  UserX,
  Plus,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const OverviewDashboard: React.FC<{ onSelectTab: (tab: string) => void }> = ({ onSelectTab }) => {
  const { campaigns, contacts, deliverabilityData, pauseCampaign, sendCampaignNow, refreshData } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalOpens = campaigns.reduce((acc, c) => acc + c.opensCount, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicksCount, 0);
  const totalBounces = campaigns.reduce((acc, c) => acc + c.bounceCount, 0);
  const totalUnsubscribes = campaigns.reduce((acc, c) => acc + c.unsubscribeCount, 0);

  const deliveredPct = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '98.9';
  const openPct = totalDelivered > 0 ? ((totalOpens / totalDelivered) * 100).toFixed(1) : '62.9';
  const clickPct = totalDelivered > 0 ? ((totalClicks / totalDelivered) * 100).toFixed(1) : '23.6';
  const bouncePct = totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) : '1.08';

  const chartData = [
    { day: 'Mon', sent: 1200, opens: 780, clicks: 310 },
    { day: 'Tue', sent: 1850, opens: 1120, clicks: 450 },
    { day: 'Wed', sent: 2400, opens: 1540, clicks: 680 },
    { day: 'Thu', sent: 3100, opens: 2010, clicks: 890 },
    { day: 'Fri', sent: 2800, opens: 1820, clicks: 760 },
    { day: 'Sat', sent: 1400, opens: 920, clicks: 380 },
    { day: 'Sun', sent: 2100, opens: 1390, clicks: 590 },
  ];

  const activeSendingCampaign = campaigns.find(c => c.status === 'sending');

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Bulk Email Marketing Overview
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Permission-based dispatches, deliverability status, and live campaign benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshData()}
            className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectTab('contacts')}
            className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={() => onSelectTab('campaigns')}
            className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - High Density */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Card 1: Sent */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Sent</span>
            <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {totalSent.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs last week</span>
          </div>
        </div>

        {/* Card 2: Delivered */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Delivered</span>
            <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <MailCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {deliveredPct}%
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>99.2% SES Inbox Placement</span>
          </div>
        </div>

        {/* Card 3: Opens */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Open Rate</span>
            <div className="p-1 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {openPct}%
          </div>
          <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
            {totalOpens.toLocaleString()} total opens
          </div>
        </div>

        {/* Card 4: Clicks */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">CTR</span>
            <div className="p-1 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <MousePointerClick className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {clickPct}%
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            {totalClicks.toLocaleString()} clicks
          </div>
        </div>

        {/* Card 5: Bounces */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Bounce Rate</span>
            <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {bouncePct}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Auto-suppressed list
          </div>
        </div>

        {/* Card 6: Unsubscribes */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Unsubscribes</span>
            <div className="p-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <UserX className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {totalUnsubscribes}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            0.04% compliance
          </div>
        </div>
      </div>

      {/* Active Campaign Live Dispatch Monitor */}
      {activeSendingCampaign && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Live Dispatching Campaign
                </span>
                <h3 className="text-base font-bold text-white">
                  {activeSendingCampaign.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => pauseCampaign(activeSendingCampaign.id)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Dispatch</span>
              </button>
              <button
                onClick={() => onSelectTab('queue')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>View Queue Logs</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-indigo-200">
              <span>Sending via Amazon SES (Rate limit: 14/sec)</span>
              <span>
                {activeSendingCampaign.sentCount} / {activeSendingCampaign.totalRecipients} ({Math.round((activeSendingCampaign.sentCount / activeSendingCampaign.totalRecipients) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(activeSendingCampaign.sentCount / activeSendingCampaign.totalRecipients) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chart & Deliverability Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement Trend Chart */}
        <div className="lg:col-span-2 p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dispatch & Engagement Benchmarks
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily trend of sent emails, opens, and link clicks
              </p>
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  dateRange === '7d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  dateRange === '30d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="sent" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" name="Sent Emails" />
                <Area type="monotone" dataKey="opens" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorOpens)" name="Opens" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sender Reputation & DNS Status */}
        <div className="p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Domain Health</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {deliverabilityData.healthScore}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Domain: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{deliverabilityData.domain}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    SPF Record
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">v=spf1 include:amazonses.com</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    DKIM Key 2048-bit
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">ses._domainkey.mailpulse.io</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    DMARC Policy
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">p=quarantine; pct=100</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('deliverability')}
            className="w-full py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Manage Deliverability & DNS
          </button>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Bulk Email Campaigns
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dispatches across target lists and active subscriber segments
            </p>
          </div>

          <button
            onClick={() => onSelectTab('campaigns')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All Campaigns →
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-2.5 px-3">Campaign Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Recipients</th>
                <th className="py-2.5 px-3">Open Rate</th>
                <th className="py-2.5 px-3">CTR</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {campaigns.map(camp => {
                const openPct = camp.deliveredCount > 0 ? ((camp.opensCount / camp.deliveredCount) * 100).toFixed(1) : '0';
                const ctrPct = camp.deliveredCount > 0 ? ((camp.clicksCount / camp.deliveredCount) * 100).toFixed(1) : '0';

                return (
                  <tr key={camp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {camp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {camp.subject}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          camp.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : camp.status === 'sending'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 animate-pulse'
                            : camp.status === 'scheduled'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {camp.totalRecipients.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {openPct}%
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {ctrPct}%
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {camp.status === 'draft' ? (
                        <button
                          onClick={() => sendCampaignNow(camp.id)}
                          className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-semibold hover:bg-indigo-500"
                        >
                          Send Now
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectTab('analytics')}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          Report
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
