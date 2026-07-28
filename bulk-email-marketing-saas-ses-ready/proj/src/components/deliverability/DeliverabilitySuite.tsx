import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Sparkles,
  Search,
  Check,
  Sliders,
  Flame,
  UserX
} from 'lucide-react';

export const DeliverabilitySuite: React.FC = () => {
  const { deliverabilityData, analyzeSpamScore, contacts } = useApp();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Spam Analyzer State
  const [testSubject, setTestSubject] = useState('Win 100% FREE Money - Act Fast & Click Here Now!');
  const [testBody, setTestBody] = useState('Hi subscriber, claim your guaranteed 100% free bonus cash investment with no risk!');
  const [spamResult, setSpamResult] = useState<{
    spamScore: number;
    foundTriggers: string[];
    recommendation: string;
  } | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAnalyzeSpam = async () => {
    const res = await analyzeSpamScore(testSubject, testBody);
    setSpamResult(res);
  };

  const unsubscribedContacts = contacts.filter(c => c.status === 'unsubscribed' || c.status === 'bounced');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span>Deliverability & Domain Health Suite</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SPF/DKIM/DMARC DNS validator, AI spam trigger analyzer, and bounce suppression list
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Domain Score: {deliverabilityData.healthScore}%</span>
          </span>
        </div>
      </div>

      {/* DNS Records Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            DNS Authentication Records (Amazon SES / SendGrid)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish these TXT & CNAME records in your domain's DNS panel (Cloudflare, Route53, GoDaddy)
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Record 1: SPF */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">TXT</span>
                <span>SPF (Sender Policy Framework)</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
              <span className="truncate">v=spf1 include:amazonses.com ~all</span>
              <button
                onClick={() => copyToClipboard('v=spf1 include:amazonses.com ~all', 'spf')}
                className="p-1 rounded text-slate-400 hover:text-indigo-500 shrink-0 ml-2"
                title="Copy record value"
              >
                {copiedField === 'spf' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Record 2: DKIM */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px]">CNAME</span>
                <span>DKIM (DomainKeys Identified Mail 2048-bit)</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
              <span className="truncate">ses._domainkey.mailpulse.io -&gt; dkim.amazonses.com</span>
              <button
                onClick={() => copyToClipboard('dkim.amazonses.com', 'dkim')}
                className="p-1 rounded text-slate-400 hover:text-indigo-500 shrink-0 ml-2"
              >
                {copiedField === 'dkim' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Record 3: DMARC */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">TXT</span>
                <span>DMARC Compliance Record</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
              <span className="truncate">v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@mailpulse.io</span>
              <button
                onClick={() => copyToClipboard('v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@mailpulse.io', 'dmarc')}
                className="p-1 rounded text-slate-400 hover:text-indigo-500 shrink-0 ml-2"
              >
                {copiedField === 'dmarc' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Spam Trigger Analyzer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spam Tester Form */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Email Content Spam Analyzer</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Test subject line & body text against common spam filter algorithms
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Email Subject Line
              </label>
              <input
                type="text"
                value={testSubject}
                onChange={e => setTestSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Email Body Text
              </label>
              <textarea
                value={testBody}
                onChange={e => setTestBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none h-24 text-xs"
              />
            </div>

            <button
              onClick={handleAnalyzeSpam}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              Analyze Spam Filter Score
            </button>
          </div>
        </div>

        {/* Spam Test Results Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Spam Score Breakdown
          </h2>

          {spamResult ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Spam Score Index
                  </div>
                  <div className={`text-3xl font-black ${spamResult.spamScore > 3 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {spamResult.spamScore.toFixed(1)} / 10
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full font-bold text-xs ${spamResult.spamScore > 3 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                  {spamResult.spamScore > 3 ? 'High Risk' : 'Passed Clean'}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Trigger Words Flagged:
                </span>
                {spamResult.foundTriggers.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {spamResult.foundTriggers.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-mono text-[11px]"
                      >
                        "{t}"
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-500">No spam trigger words detected!</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
                <span className="font-bold">Optimization Advice: </span>
                {spamResult.recommendation}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Click "Analyze Spam Filter Score" to test your message content.
            </div>
          )}
        </div>
      </div>

      {/* Suppression List Manager */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-500" />
              <span>Bounce & Unsubscribe Auto-Suppression List</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Addresses automatically blocked to preserve sender domain reputation
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-3 px-2">Suppressed Email</th>
                <th className="pb-3 px-2">Reason</th>
                <th className="pb-3 px-2">Date Added</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
              {unsubscribedContacts.map(c => (
                <tr key={c.id}>
                  <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200">
                    {c.email}
                  </td>
                  <td className="py-2.5 px-2 font-sans font-medium text-slate-500 capitalize">
                    {c.status}
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-400 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                      Suppressed
                    </span>
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
