import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Users,
  Shield,
  Key,
  Server,
  Activity,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { smtpConfigs, updateSMTPConfig, auditLogs } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'smtp' | 'logs'>('users');

  // SMTP Form State
  const [provider, setProvider] = useState<'amazon_ses' | 'sendgrid' | 'brevo'>('amazon_ses');
  const [apiKey, setApiKey] = useState('AKIA_SAMPLE_PROD_KEY_SECRET');
  const [region, setRegion] = useState('us-east-1');
  const [fromDomain, setFromDomain] = useState('mailpulse.io');

  const usersList = [
    { id: 'usr_admin', name: 'Sarah Connor', email: 'admin@mailpulse.io', role: 'admin', status: 'active', quota: '500,000 / mo' },
    { id: 'usr_manager', name: 'Alex Rivera', email: 'alex@marketing.com', role: 'manager', status: 'active', quota: '250,000 / mo' },
    { id: 'usr_marketer', name: 'David Kim', email: 'david@saascorp.com', role: 'marketer', status: 'active', quota: '50,000 / mo' },
  ];

  const handleSaveSMTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSMTPConfig({
      provider,
      apiKey,
      region,
      fromDomain
    });
    alert('SMTP Provider settings updated & verified successfully!');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-500" />
            <span>SaaS Admin & System Operations</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            User management, multi-provider SMTP configurations, and security audit logs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'users' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          User Accounts & Quotas
        </button>
        <button
          onClick={() => setActiveTab('smtp')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'smtp' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          SMTP Providers (SES / SendGrid / Brevo)
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'logs' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Security Audit Logs
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered SaaS Organizations & Users
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2">Quota Limit</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {u.quota}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] capitalize">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200">
                        Edit Limits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SMTP PROVIDERS */}
      {activeTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleSaveSMTP}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-500" />
              <span>Configure Primary Email Provider</span>
            </h2>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Email Provider Service
              </label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
              >
                <option value="amazon_ses">Amazon SES (Primary - High Volume)</option>
                <option value="sendgrid">SendGrid (Backup Provider)</option>
                <option value="brevo">Brevo / Sendinblue</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                API Key / Secret Token *
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
              />
            </div>

            {provider === 'amazon_ses' && (
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  AWS Region
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Verified Sending Domain
              </label>
              <input
                type="text"
                value={fromDomain}
                onChange={e => setFromDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
            >
              Verify & Save Provider
            </button>
          </form>

          {/* Active Config Cards */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Provider Status
            </h2>

            {smtpConfigs.map(cfg => (
              <div
                key={cfg.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    {cfg.provider.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                    {cfg.isActive ? 'Active' : 'Standby'}
                  </span>
                </div>
                <p className="font-mono text-slate-500">Domain: {cfg.fromDomain}</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Rate limit: {cfg.sendingLimitPerSec} msgs/sec | Quota: {cfg.dailyUsed.toLocaleString()} / {cfg.dailyQuota.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Security Audit Trail
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                  <th className="pb-3 px-2">User</th>
                  <th className="pb-3 px-2">Action</th>
                  <th className="pb-3 px-2">Details</th>
                  <th className="pb-3 px-2">IP Address</th>
                  <th className="pb-3 px-2 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="py-2.5 px-2 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-2 font-sans text-slate-600 dark:text-slate-400">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400 font-sans">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
