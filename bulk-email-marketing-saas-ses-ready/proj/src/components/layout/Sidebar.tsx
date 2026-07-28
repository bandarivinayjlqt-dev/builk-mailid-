import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Send,
  Users,
  FileCode2,
  Cpu,
  ShieldCheck,
  BarChart3,
  Settings,
  Key
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'contacts', label: 'Audience & Lists', icon: Users },
    { id: 'templates', label: 'Email Builder', icon: FileCode2 },
    { id: 'queue', label: 'Queue Engine', icon: Cpu },
    { id: 'deliverability', label: 'Deliverability & DNS', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Operations', icon: Settings }] : []),
    { id: 'api', label: 'API & Webhooks', icon: Key },
  ];

  return (
    <aside className="w-56 bg-[#0F172A] text-slate-400 flex flex-col flex-shrink-0 justify-between select-none border-r border-slate-800">
      <div>
        {/* Brand Logo in Sidebar */}
        <div
          onClick={() => onSelectTab('overview')}
          className="p-4 px-5 flex items-center gap-3 cursor-pointer group border-b border-slate-800/80"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:bg-indigo-500 transition-colors shrink-0">
            M
          </div>
          <div className="overflow-hidden">
            <span className="text-white font-bold text-sm tracking-tight block leading-tight">
              MailStream
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              High Density SaaS
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3">
          <p className="px-3 mb-2 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Account Credits Box */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/90 rounded-md p-3 space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-slate-400">
            <span>Account Credits</span>
            <span className="text-emerald-400 font-bold">99.4% Health</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-white font-bold text-xs">
              {((user?.quotaUsed || 84200)).toLocaleString()} / {((user?.quotaLimit || 100000)).toLocaleString()}
            </span>
            <button
              onClick={() => onSelectTab('admin')}
              className="text-[10px] text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '84.2%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
};

