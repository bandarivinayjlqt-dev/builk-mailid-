import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, CampaignStatus } from '../../types';
import {
  Send,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  List,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Copy,
  Eye
} from 'lucide-react';

export const CampaignManager: React.FC<{ onSelectTab: (tab: string) => void }> = ({ onSelectTab }) => {
  const { campaigns, contactLists, templates, createCampaign, sendCampaignNow, pauseCampaign } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const [campaignName, setCampaignName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [preheader, setPreheader] = useState('');
  const [senderName, setSenderName] = useState('Sarah Connor');
  const [senderEmail, setSenderEmail] = useState('sarah@mailpulse.io');
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl_welcome');

  // A/B Testing
  const [abEnabled, setAbEnabled] = useState(false);
  const [subjectLineB, setSubjectLineB] = useState('');
  const [sampleSize, setSampleSize] = useState(20);

  // Schedule
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-08-01T10:00');

  const filteredCampaigns = campaigns.filter(c => {
    if (activeFilter === 'all') return true;
    return c.status === activeFilter;
  });

  const toggleListSelection = (listId: string) => {
    if (selectedListIds.includes(listId)) {
      setSelectedListIds(selectedListIds.filter(id => id !== listId));
    } else {
      setSelectedListIds([...selectedListIds, listId]);
    }
  };

  const handleFinishWizard = async () => {
    if (!campaignName || !subjectLine) {
      alert('Please fill out Campaign Name and Subject Line.');
      return;
    }

    const created = await createCampaign({
      name: campaignName,
      subject: subjectLine,
      preheader,
      senderName,
      senderEmail,
      replyTo: senderEmail,
      templateId: selectedTemplateId,
      listIds: selectedListIds,
      scheduledAt: scheduleType === 'schedule' ? scheduledDateTime : undefined,
      abTest: abEnabled
        ? {
            enabled: true,
            subjectLineB,
            sampleSizePercent: sampleSize,
            winningMetric: 'opens'
          }
        : undefined
    });

    if (scheduleType === 'now') {
      await sendCampaignNow(created.id);
    }

    setShowWizard(false);
    setWizardStep(1);
    setCampaignName('');
    setSubjectLine('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Send className="w-6 h-6 text-indigo-500" />
            <span>Bulk Campaign Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permission-based email dispatch wizard, A/B testing, and queue throttler
          </p>
        </div>

        <button
          onClick={() => {
            if (contactLists.length > 0) setSelectedListIds([contactLists[0].id]);
            setShowWizard(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold text-slate-500">
        {['all', 'draft', 'scheduled', 'sending', 'sent', 'paused'].map(status => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`pb-3 capitalize transition-colors relative ${
              activeFilter === status
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {status} ({campaigns.filter(c => status === 'all' || c.status === status).length})
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map(camp => {
          const openRate = camp.deliveredCount > 0 ? ((camp.opensCount / camp.deliveredCount) * 100).toFixed(1) : '0';
          const clickRate = camp.deliveredCount > 0 ? ((camp.clicksCount / camp.deliveredCount) * 100).toFixed(1) : '0';

          return (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      camp.status === 'sent'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : camp.status === 'sending'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 animate-pulse'
                        : camp.status === 'scheduled'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                    {camp.name}
                  </h3>
                </div>

                {camp.abTest?.enabled && (
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 font-bold text-[10px]">
                    A/B Test
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                  Subject: {camp.subject}
                </p>
                <p className="text-[10px] text-slate-500">
                  From: {camp.senderName} ({camp.senderEmail})
                </p>
              </div>

              {/* Progress bar if sending */}
              {camp.status === 'sending' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Dispatch Progress</span>
                    <span>
                      {camp.sentCount} / {camp.totalRecipients}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(camp.sentCount / camp.totalRecipients) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {camp.totalRecipients.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Recipients</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {openRate}%
                  </div>
                  <div className="text-[10px] text-slate-400">Open Rate</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {clickRate}%
                  </div>
                  <div className="text-[10px] text-slate-400">CTR</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {camp.status === 'draft' && (
                  <button
                    onClick={() => sendCampaignNow(camp.id)}
                    className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                  >
                    Dispatch Now
                  </button>
                )}

                {camp.status === 'sending' && (
                  <button
                    onClick={() => pauseCampaign(camp.id)}
                    className="w-full py-2 rounded-xl bg-amber-500/20 text-amber-600 font-semibold text-xs hover:bg-amber-500/30"
                  >
                    Pause Campaign
                  </button>
                )}

                {camp.status === 'sent' && (
                  <button
                    onClick={() => onSelectTab('analytics')}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                  >
                    View Analytics Report →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CAMPAIGN CREATION WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl text-xs">
            {/* Wizard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  Step {wizardStep} of 4
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {wizardStep === 1 && 'Campaign Details & Sender Identity'}
                  {wizardStep === 2 && 'Target Recipients & Contact Lists'}
                  {wizardStep === 3 && 'Email Template & A/B Testing'}
                  {wizardStep === 4 && 'Schedule & Dispatch Confirmation'}
                </h2>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: DETAILS */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    placeholder="e.g. Q3 EduLearn Alumni Newsletter"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Subject Line (Use variables like {"{{first_name}}"}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectLine}
                    onChange={e => setSubjectLine(e.target.value)}
                    placeholder="e.g. Exclusive {{course}} Refresher Course inside, {{first_name}}!"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Preheader Snippet Text
                  </label>
                  <input
                    type="text"
                    value={preheader}
                    onChange={e => setPreheader(e.target.value)}
                    placeholder="Preview text shown next to subject line in inbox..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Sender Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Sender Email</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={e => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: RECIPIENTS */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Select target permission contact lists for this dispatch:
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {contactLists.map(list => {
                    const isSelected = selectedListIds.includes(list.id);
                    return (
                      <div
                        key={list.id}
                        onClick={() => toggleListSelection(list.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{list.name}</div>
                          <div className="text-[10px] text-slate-500">{list.description}</div>
                        </div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {list.contactCount} subscribers
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: TEMPLATE & A/B TEST */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Select Email Template
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={e => setSelectedTemplateId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* A/B Test Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">A/B Subject Testing</div>
                      <div className="text-[10px] text-slate-500">Test 2 subject lines on sample audience</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={abEnabled}
                      onChange={e => setAbEnabled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  {abEnabled && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="block font-medium mb-1 text-slate-700 dark:text-slate-300">
                          Subject Line Variant B
                        </label>
                        <input
                          type="text"
                          value={subjectLineB}
                          onChange={e => setSubjectLineB(e.target.value)}
                          placeholder="Alternative catchy subject line..."
                          className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE & CONFIRM */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
                    Dispatch Summary
                  </h4>
                  <p><strong>Campaign:</strong> {campaignName}</p>
                  <p><strong>Subject:</strong> {subjectLine}</p>
                  <p><strong>Lists Selected:</strong> {selectedListIds.length} lists</p>
                  <p><strong>Rate Limit:</strong> Amazon SES 14 msgs/sec auto-throttled</p>
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Dispatch Time Option
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sched"
                        checked={scheduleType === 'now'}
                        onChange={() => setScheduleType('now')}
                      />
                      <span>Send Immediately</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sched"
                        checked={scheduleType === 'schedule'}
                        onChange={() => setScheduleType('schedule')}
                      />
                      <span>Schedule for Later</span>
                    </label>
                  </div>

                  {scheduleType === 'schedule' && (
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={e => setScheduledDateTime(e.target.value)}
                      className="mt-2 w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Back
              </button>

              {wizardStep < 4 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishWizard}
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/25"
                >
                  Confirm & Dispatch
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
