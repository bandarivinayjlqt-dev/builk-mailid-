import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailTemplate, TemplateBlock, BlockType } from '../../types';
import {
  FileCode2,
  Plus,
  Trash2,
  Eye,
  Smartphone,
  Monitor,
  Send,
  Save,
  Tag,
  Code,
  Layout,
  Sparkles,
  Layers
} from 'lucide-react';

export const TemplateBuilder: React.FC = () => {
  const { templates, saveTemplate, testSendEmail } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(
    templates[0] || {
      id: 'tpl_custom',
      name: 'Custom Marketing Blast',
      description: 'Personalized email campaign',
      category: 'promotional',
      blocks: [
        {
          id: 'b1',
          type: 'header',
          content: { title: 'Special Announcement for {{first_name}}! 🚀', align: 'center', backgroundColor: '#4f46e5', textColor: '#ffffff' }
        },
        {
          id: 'b2',
          type: 'text',
          content: { text: 'Hi {{first_name}},\n\nWe have exciting updates regarding {{course}} at {{company}}.\n\nClick below to claim your access:', align: 'left' }
        },
        {
          id: 'b3',
          type: 'button',
          content: { buttonText: 'Claim Access Now', buttonUrl: 'https://mailpulse.io', buttonBgColor: '#4f46e5', buttonTextColor: '#ffffff', align: 'center' }
        },
        {
          id: 'b4',
          type: 'unsubscribe_footer',
          content: { text: 'MailPulse Platform Inc. Click here to {{unsubscribe_url}}' }
        }
      ],
      htmlContent: '<h1>Welcome</h1>',
      textContent: 'Welcome',
      updatedAt: new Date().toISOString()
    }
  );

  const [activeView, setActiveView] = useState<'editor' | 'html' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Test Email Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('you@company.com');
  const [testResult, setTestResult] = useState<{ parsedSubject: string; parsedBody: string } | null>(null);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: TemplateBlock = {
      id: `blk_${Date.now()}`,
      type,
      content: {
        title: type === 'header' ? 'New Section Header' : undefined,
        text: type === 'text' ? 'Add your email message here...' : undefined,
        buttonText: type === 'button' ? 'Click Here' : undefined,
        buttonUrl: type === 'button' ? 'https://example.com' : undefined,
        align: 'left',
        backgroundColor: type === 'header' ? '#4f46e5' : '#ffffff',
        textColor: type === 'header' ? '#ffffff' : '#1e293b',
        buttonBgColor: '#4f46e5',
        buttonTextColor: '#ffffff'
      }
    };
    setSelectedTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const handleUpdateBlockContent = (blockId: string, key: string, value: any) => {
    setSelectedTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === blockId ? { ...b, content: { ...b.content, [key]: value } } : b))
    }));
  };

  const handleRemoveBlock = (blockId: string) => {
    setSelectedTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId)
    }));
  };

  const handleInsertVariable = (blockId: string, variableTag: string) => {
    const block = selectedTemplate.blocks.find(b => b.id === blockId);
    if (!block) return;
    const currentText = block.content.text || block.content.title || '';
    handleUpdateBlockContent(
      blockId,
      block.type === 'header' ? 'title' : 'text',
      `${currentText} ${variableTag}`
    );
  };

  const handleSave = async () => {
    await saveTemplate(selectedTemplate);
    alert('Template saved successfully!');
  };

  const handleSendTest = async () => {
    const res = await testSendEmail('cmp_201', testEmailAddress, 'Alex', 'Full-Stack Engineering');
    setTestResult(res);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-indigo-500" />
            <span>Drag & Drop Email Builder</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build high-converting responsive HTML emails with variable tag substitution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTestModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-indigo-500" />
            <span>Send Test Email</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Template</span>
          </button>
        </div>
      </div>

      {/* Preset Picker Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 overflow-x-auto text-xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0">
          Template Presets:
        </span>
        {templates.map(tpl => (
          <button
            key={tpl.id}
            onClick={() => setSelectedTemplate(tpl)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              selectedTemplate.id === tpl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* View Switcher & Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('editor')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeView === 'editor' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
          </button>
          <button
            onClick={() => setActiveView('html')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeView === 'html' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML & Plain Text</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeView === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Inbox Preview</span>
          </button>
        </div>

        {activeView === 'preview' && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-400'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-400'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: VISUAL BUILDER */}
      {activeView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Canvas (Email Blocks) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-h-[500px]">
              {selectedTemplate.blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-500" />
                      Block {idx + 1}: {block.type}
                    </span>

                    {/* Variable Quick Inserter */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">Insert tag:</span>
                      <button
                        onClick={() => handleInsertVariable(block.id, '{{first_name}}')}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 text-[10px] font-mono hover:scale-105"
                      >
                        first_name
                      </button>
                      <button
                        onClick={() => handleInsertVariable(block.id, '{{course}}')}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 text-[10px] font-mono hover:scale-105"
                      >
                        course
                      </button>
                      <button
                        onClick={() => handleInsertVariable(block.id, '{{company}}')}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 text-[10px] font-mono hover:scale-105"
                      >
                        company
                      </button>

                      <button
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 ml-2"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Editor Form Input Fields */}
                  {block.type === 'header' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.content.title || ''}
                        onChange={e => handleUpdateBlockContent(block.id, 'title', e.target.value)}
                        placeholder="Header Title..."
                        className="w-full font-bold text-lg px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div className="space-y-2">
                      <textarea
                        value={block.content.text || ''}
                        onChange={e => handleUpdateBlockContent(block.id, 'text', e.target.value)}
                        placeholder="Email paragraph text..."
                        className="w-full text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none h-24 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  )}

                  {block.type === 'button' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={block.content.buttonText || ''}
                          onChange={e => handleUpdateBlockContent(block.id, 'buttonText', e.target.value)}
                          className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Target URL</label>
                        <input
                          type="text"
                          value={block.content.buttonUrl || ''}
                          onChange={e => handleUpdateBlockContent(block.id, 'buttonUrl', e.target.value)}
                          className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'unsubscribe_footer' && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-500 space-y-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        Mandatory CAN-SPAM / GDPR Unsubscribe Footer
                      </p>
                      <textarea
                        value={block.content.text || ''}
                        onChange={e => handleUpdateBlockContent(block.id, 'text', e.target.value)}
                        className="w-full p-2 text-[10px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-16"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Controls Sidebar (Add Blocks) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Add Content Block</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleAddBlock('header')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all font-medium text-slate-800 dark:text-slate-200"
                >
                  ➕ Header Banner
                </button>
                <button
                  onClick={() => handleAddBlock('text')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all font-medium text-slate-800 dark:text-slate-200"
                >
                  📝 Text Paragraph
                </button>
                <button
                  onClick={() => handleAddBlock('button')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all font-medium text-slate-800 dark:text-slate-200"
                >
                  🔘 Call-To-Action
                </button>
                <button
                  onClick={() => handleAddBlock('unsubscribe_footer')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all font-medium text-slate-800 dark:text-slate-200"
                >
                  🛡️ Unsubscribe Footer
                </button>
              </div>
            </div>

            {/* Variable Cheat Sheet */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <h3 className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Available Personalization Variables</span>
              </h3>
              <div className="space-y-1.5 text-[11px] font-mono text-indigo-100">
                <p><span className="text-amber-400">{`{{first_name}}`}</span> — Recipient First Name</p>
                <p><span className="text-amber-400">{`{{last_name}}`}</span> — Recipient Last Name</p>
                <p><span className="text-amber-400">{`{{company}}`}</span> — Company Name</p>
                <p><span className="text-amber-400">{`{{course}}`}</span> — Enrolled Course</p>
                <p><span className="text-amber-400">{`{{unsubscribe_url}}`}</span> — Instant Opt-out Link</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HTML & PLAIN TEXT */}
      {activeView === 'html' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Compiled Raw HTML Code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Responsive inline CSS markup ready for Amazon SES / SendGrid
            </p>
          </div>

          <textarea
            value={selectedTemplate.htmlContent}
            onChange={e => setSelectedTemplate({ ...selectedTemplate, htmlContent: e.target.value })}
            className="w-full h-80 p-4 font-mono text-xs rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 outline-none leading-relaxed"
          />
        </div>
      )}

      {/* VIEW 3: LIVE INBOX PREVIEW */}
      {activeView === 'preview' && (
        <div className="flex justify-center p-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div
            className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all ${
              previewDevice === 'mobile' ? 'max-w-xs w-full' : 'max-w-2xl w-full'
            }`}
          >
            {/* Mock Email Client Header */}
            <div className="bg-slate-100 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>From: Sarah Connor &lt;sarah@mailpulse.io&gt;</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                To: <span className="text-indigo-500 font-mono">alex.rivera@example.com</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white pt-1">
                Subject: Welcome to EduLearn, Alex! 🚀
              </div>
            </div>

            {/* Rendered Email Content */}
            <div className="p-6 space-y-4 text-slate-800 dark:text-slate-200 text-xs">
              {selectedTemplate.blocks.map(b => (
                <div key={b.id}>
                  {b.type === 'header' && (
                    <div
                      style={{ backgroundColor: b.content.backgroundColor || '#4f46e5', color: b.content.textColor || '#ffffff' }}
                      className="p-6 rounded-xl text-center font-bold text-lg shadow-sm"
                    >
                      {b.content.title?.replace('{{first_name}}', 'Alex')}
                    </div>
                  )}

                  {b.type === 'text' && (
                    <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                      {b.content.text
                        ?.replace('{{first_name}}', 'Alex')
                        .replace('{{course}}', 'Full-Stack Web Dev')
                        .replace('{{company}}', 'Acme Corp')}
                    </p>
                  )}

                  {b.type === 'button' && (
                    <div className="text-center my-4">
                      <a
                        href={b.content.buttonUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundColor: b.content.buttonBgColor || '#4f46e5', color: b.content.buttonTextColor || '#ffffff' }}
                        className="inline-block px-6 py-2.5 rounded-xl font-bold shadow-md"
                      >
                        {b.content.buttonText}
                      </a>
                    </div>
                  )}

                  {b.type === 'unsubscribe_footer' && (
                    <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 text-center space-y-1">
                      <p>{b.content.text}</p>
                      <a href="#unsubscribe" className="text-indigo-500 underline">Unsubscribe instantly</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEST EMAIL MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              <span>Send Test Email Payload</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Recipient Test Address
                </label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={e => setTestEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <p className="font-bold">Test Email Dispatched!</p>
                  <p className="text-[11px]">Subject: {testResult.parsedSubject}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleSendTest}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md"
              >
                Send Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
