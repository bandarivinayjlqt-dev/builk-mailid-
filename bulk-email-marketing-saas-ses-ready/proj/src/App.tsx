import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ContactManager } from './components/contacts/ContactManager';
import { TemplateBuilder } from './components/templates/TemplateBuilder';
import { CampaignManager } from './components/campaigns/CampaignManager';
import { QueueMonitor } from './components/queue/QueueMonitor';
import { DeliverabilitySuite } from './components/deliverability/DeliverabilitySuite';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AdminPanel } from './components/admin/AdminPanel';
import { ApiAndWebhooks } from './components/settings/ApiAndWebhooks';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { loading, queueJobs } = useApp();

  const queuedCount = queueJobs.filter(j => j.status === 'queued').length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      {/* High Density Left Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* View Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center h-full p-12">
              <div className="flex items-center gap-3 text-slate-500 font-medium text-xs">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Initializing High Density Mail Engine...</span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewDashboard onSelectTab={setActiveTab} />}
              {activeTab === 'campaigns' && <CampaignManager onSelectTab={setActiveTab} />}
              {activeTab === 'contacts' && <ContactManager />}
              {activeTab === 'templates' && <TemplateBuilder />}
              {activeTab === 'queue' && <QueueMonitor />}
              {activeTab === 'deliverability' && <DeliverabilitySuite />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'admin' && <AdminPanel />}
              {activeTab === 'api' && <ApiAndWebhooks />}
            </>
          )}
        </main>

        {/* High Density Footer Status Bar */}
        <footer className="h-9 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between text-[10px] text-slate-500 uppercase font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: <strong className="text-slate-700 dark:text-slate-300">All Nodes Operational</strong></span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:inline">Provider: <strong className="text-slate-700 dark:text-slate-300">Amazon SES (us-east-1)</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Latency: <strong className="text-slate-700 dark:text-slate-300">124ms</strong></span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span>Active Queue: <strong className={queuedCount > 0 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-700 dark:text-slate-300"}>{queuedCount} Tasks</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}

