import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Shield,
  UserCheck,
  Zap,
  Activity,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC<{ activeTab: string; onSelectTab: (tab: string) => void }> = ({
  activeTab,
  onSelectTab,
}) => {
  const { user, theme, toggleTheme, logout, switchRole } = useAuth();
  const { campaigns, queueJobs } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeSending = campaigns.filter(c => c.status === 'sending');
  const pendingQueueCount = queueJobs.filter(j => j.status === 'queued').length;

  const tabTitles: Record<string, string> = {
    overview: 'Performance Overview',
    campaigns: 'Bulk Campaigns',
    contacts: 'Audience & Contact Lists',
    templates: 'Email Template Builder',
    queue: 'BullMQ Queue Monitor',
    deliverability: 'Deliverability & Domain Health',
    analytics: 'Campaign Analytics & Reports',
    admin: 'SaaS Admin Operations',
    api: 'Developer REST API & Webhooks',
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 flex items-center justify-between shrink-0 transition-colors z-30">
      {/* Title & Live Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
          {tabTitles[activeTab] || 'Performance Overview'}
        </h1>

        {/* Live Queue Indicator */}
        {activeSending.length > 0 && (
          <div
            onClick={() => onSelectTab('queue')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold cursor-pointer animate-pulse"
          >
            <Activity className="w-3 h-3" />
            <span>Sending ({activeSending[0].sentCount}/{activeSending[0].totalRecipients})</span>
          </div>
        )}
      </div>

      {/* Search Bar & User Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* High-density pill Search Bar */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none rounded-full pl-8 pr-4 py-1.5 w-48 md:w-64 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              title="Switch Access Role"
            >
              <Shield className="w-3 h-3 text-indigo-500" />
              <span className="capitalize">{user?.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test Account Role
                </div>
                <button
                  onClick={() => { switchRole('admin'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${user?.role === 'admin' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>Administrator</span>
                  {user?.role === 'admin' && <UserCheck className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { switchRole('manager'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 ${user?.role === 'manager' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>Campaign Manager</span>
                  {user?.role === 'manager' && <UserCheck className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {pendingQueueCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                  <span>System Alerts</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">100% Operational</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 text-[11px] space-y-0.5">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    <span>Amazon SES Throttle Guard</span>
                  </div>
                  <p className="text-slate-500">14 msgs/sec queue rate enforced.</p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
              {user?.company || 'Acme Marketing'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {user?.name}
            </p>
          </div>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <button
            onClick={logout}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-rose-500 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

