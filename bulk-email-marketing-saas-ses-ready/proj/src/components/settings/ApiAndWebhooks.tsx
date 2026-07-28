import React, { useState } from 'react';
import { Key, Copy, Check, Plus, Code, Shield } from 'lucide-react';

export const ApiAndWebhooks: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const apiKey = 'mp_live_8f391209bca74e2a90183719280148';

  const [webhooks, setWebhooks] = useState([
    { id: 'wh_1', url: 'https://api.mycompany.com/webhooks/mailpulse', events: ['email.delivered', 'email.bounced', 'email.clicked'] }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl) return;
    setWebhooks([
      ...webhooks,
      { id: `wh_${Date.now()}`, url: newWebhookUrl, events: ['email.delivered', 'email.bounced'] }
    ]);
    setNewWebhookUrl('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Key className="w-6 h-6 text-indigo-500" />
            <span>Developer REST API & Webhooks</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Programmatically dispatch campaigns, query subscriber lists, and listen for bounce events
          </p>
        </div>
      </div>

      {/* API Key Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Active Production API Secret Key
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
          />
          <button
            onClick={copyKey}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 flex items-center gap-1.5 shadow-md"
          >
            {copiedKey ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey ? 'Copied Key!' : 'Copy Key'}</span>
          </button>
        </div>
      </div>

      {/* Code Snippet Example */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-500" />
          <span>cURL Integration Request Example</span>
        </h2>
        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X POST https://mailpulse.io/api/v1/campaigns \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Q3 API Dispatch",
    "subject": "Hello {{first_name}}!",
    "listIds": ["list_1"],
    "templateId": "tpl_welcome"
  }'`}
        </pre>
      </div>

      {/* Webhooks Manager */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Active Webhook Subscriptions
        </h2>

        <form onSubmit={handleAddWebhook} className="flex gap-2">
          <input
            type="url"
            required
            placeholder="https://yourdomain.com/webhooks/mailpulse"
            value={newWebhookUrl}
            onChange={e => setNewWebhookUrl(e.target.value)}
            className="w-full max-w-md p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
          >
            Add Webhook
          </button>
        </form>

        <div className="space-y-2">
          {webhooks.map(w => (
            <div key={w.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <div className="font-mono font-bold text-slate-900 dark:text-white">{w.url}</div>
                <div className="text-[10px] text-slate-500">Events: {w.events.join(', ')}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                Active Listener
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
