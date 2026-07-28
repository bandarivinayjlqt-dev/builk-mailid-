import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Server
} from 'lucide-react';

export const QueueMonitor: React.FC = () => {
  const { queueJobs, triggerNextQueueJob, refreshData } = useApp();
  const [autoTickerActive, setAutoTickerActive] = useState(true);

  const queuedCount = queueJobs.filter(j => j.status === 'queued').length;
  const sendingCount = queueJobs.filter(j => j.status === 'sending').length;
  const sentCount = queueJobs.filter(j => j.status === 'sent').length;
  const failedCount = queueJobs.filter(j => j.status === 'failed').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-500" />
            <span>BullMQ & Redis Background Queue Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time async worker dispatch engine, rate throttler, and retry supervisor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerNextQueueJob()}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Force Process Next Job</span>
          </button>
          <button
            onClick={() => refreshData()}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pending Backlog</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {queuedCount}
          </div>
          <div className="text-[10px] text-slate-400">Buffered in Redis</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Active Workers</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            4 / 4
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">100% Worker Capacity</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Rate Limit Policy</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            14 / sec
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Amazon SES Throttler Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Delivered Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {sentCount}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">0.0% Failure Rate</div>
        </div>
      </div>

      {/* Live Log Stream Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Real-Time Dispatch Job Feed</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live BullMQ queue state changes, retries, and worker threads
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 px-2">Job ID</th>
                <th className="pb-3 px-2">Campaign</th>
                <th className="pb-3 px-2">Recipient</th>
                <th className="pb-3 px-2">Provider</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Attempts</th>
                <th className="pb-3 px-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
              {queueJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-2 font-semibold text-indigo-600 dark:text-indigo-400">
                    {job.id}
                  </td>
                  <td className="py-3 px-2 font-sans font-medium text-slate-800 dark:text-slate-200">
                    {job.campaignName}
                  </td>
                  <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                    {job.recipientEmail}
                  </td>
                  <td className="py-3 px-2 font-sans text-slate-500">
                    Amazon SES
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold capitalize ${
                        job.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : job.status === 'sending'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 animate-pulse'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {job.attempts} / {job.maxAttempts}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-400 text-[11px]">
                    {job.sentAt ? new Date(job.sentAt).toLocaleTimeString() : 'In Queue'}
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
