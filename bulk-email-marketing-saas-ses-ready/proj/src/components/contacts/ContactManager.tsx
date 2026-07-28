import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Papa from 'papaparse';
import {
  Users,
  UserPlus,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ListPlus,
  Download,
  AlertCircle,
  Copy,
  Tag
} from 'lucide-react';

export const ContactManager: React.FC = () => {
  const {
    contacts,
    contactLists,
    addContact,
    deleteContact,
    createContactList,
    importContactsCSV,
    deduplicateContacts
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contacts' | 'lists'>('contacts');
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // CSV Modal State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [targetListId, setTargetListId] = useState<string>(contactLists[0]?.id || 'list_1');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    course: '',
  });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; duplicates: number } | null>(null);

  // New Contact / List Modals
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactFirstName, setNewContactFirstName] = useState('');
  const [newContactLastName, setNewContactLastName] = useState('');
  const [newContactCompany, setNewContactCompany] = useState('');

  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Handle CSV Upload
  const handleCsvFileUpload = (file: File) => {
    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setCsvData(results.data);
          const headers = Object.keys(results.data[0]);
          setCsvHeaders(headers);

          // Auto-guess mapping
          const autoMap: Record<string, string> = { email: '', firstName: '', lastName: '', company: '', course: '' };
          headers.forEach(h => {
            const lower = h.toLowerCase();
            if (lower.includes('email')) autoMap.email = h;
            else if (lower.includes('first')) autoMap.firstName = h;
            else if (lower.includes('last')) autoMap.lastName = h;
            else if (lower.includes('company')) autoMap.company = h;
            else if (lower.includes('course') || lower.includes('bootcamp')) autoMap.course = h;
          });
          setColumnMapping(autoMap);
        }
      },
    });
  };

  const handleExecuteImport = async () => {
    if (!columnMapping.email) {
      alert('Please select which column contains the Email address');
      return;
    }
    setImporting(true);

    const formattedItems = csvData.map(row => ({
      email: row[columnMapping.email],
      firstName: columnMapping.firstName ? row[columnMapping.firstName] : 'Subscriber',
      lastName: columnMapping.lastName ? row[columnMapping.lastName] : '',
      company: columnMapping.company ? row[columnMapping.company] : '',
      course: columnMapping.course ? row[columnMapping.course] : '',
    }));

    const result = await importContactsCSV(targetListId, formattedItems);
    setImportResult({ imported: result.importedCount, duplicates: result.duplicatesCount });
    setImporting(false);
  };

  const handleCreateNewContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactEmail) return;
    await addContact({
      email: newContactEmail,
      firstName: newContactFirstName || 'Subscriber',
      lastName: newContactLastName,
      company: newContactCompany,
      listIds: [targetListId]
    });
    setNewContactEmail('');
    setNewContactFirstName('');
    setNewContactLastName('');
    setShowAddContactModal(false);
  };

  const handleCreateNewList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName) return;
    await createContactList(newListName, newListDesc, ['Custom']);
    setNewListName('');
    setNewListDesc('');
    setShowAddListModal(false);
  };

  const handleDeduplicate = async () => {
    const removed = await deduplicateContacts();
    alert(`Deduplication finished! Purged ${removed} duplicate contacts.`);
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesList = selectedListId === 'all' || c.listIds.includes(selectedListId);
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesList && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            <span>Contact Lists & Audience Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permission-based contacts, CSV importer, deduplication, and subscriber segments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeduplicate}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            title="Find and purge duplicate email addresses"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-500" />
            <span>Remove Duplicates</span>
          </button>

          <button
            onClick={() => {
              setImportResult(null);
              setShowCsvModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            <span>Import CSV / Excel</span>
          </button>

          <button
            onClick={() => setShowAddContactModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'contacts' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('lists')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'lists' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Contact Lists ({contactLists.length})
        </button>
      </div>

      {/* TAB 1: ALL CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
              />
            </div>

            {/* List Filter */}
            <div>
              <select
                value={selectedListId}
                onChange={e => setSelectedListId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="all">All Lists ({contactLists.length})</option>
                {contactLists.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.contactCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active (Subscribed)</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced (Hard/Soft)</option>
              </select>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="pb-3 px-2">Contact</th>
                  <th className="pb-3 px-2">Company / Course</th>
                  <th className="pb-3 px-2">Lists & Tags</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Engagement</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredContacts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.firstName} {c.lastName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {c.email}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {c.company || '—'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {c.course || ''}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map(t => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          c.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : c.status === 'unsubscribed'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      {c.opensCount} opens / {c.clicksCount} clicks
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => deleteContact(c.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT LISTS */}
      {activeTab === 'lists' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddListModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
            >
              <ListPlus className="w-4 h-4" />
              <span>Create List</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactLists.map(list => (
              <div
                key={list.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {list.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {list.description || 'Permission contact collection'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400 font-bold text-xs">
                    {list.contactCount.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {list.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      setSelectedListId(list.id);
                      setActiveTab('contacts');
                    }}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Subscribers →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV IMPORTER MODAL */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                <span>Import Contacts via CSV / Excel</span>
              </h2>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!csvFile ? (
              <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Upload your CSV file containing email contacts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Columns like Email, First Name, Last Name, Company, Course
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={e => e.target.files?.[0] && handleCsvFileUpload(e.target.files[0])}
                  className="hidden"
                  id="csv-file-input"
                />
                <label
                  htmlFor="csv-file-input"
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer hover:bg-indigo-500 shadow-md"
                >
                  Browse Computer
                </label>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                    File: {csvFile.name} ({csvData.length} records parsed)
                  </span>
                  <button
                    onClick={() => {
                      setCsvFile(null);
                      setCsvData([]);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Change File
                  </button>
                </div>

                {/* Target List Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Contact List:
                  </label>
                  <select
                    value={targetListId}
                    onChange={e => setTargetListId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                  >
                    {contactLists.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Column Mapping Wizard */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-800 dark:text-slate-200">
                    Map CSV Columns to System Fields:
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Email Address (Required):</span>
                      <select
                        value={columnMapping.email}
                        onChange={e => setColumnMapping({ ...columnMapping, email: e.target.value })}
                        className="w-full mt-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="">Select column...</option>
                        {csvHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">First Name:</span>
                      <select
                        value={columnMapping.firstName}
                        onChange={e => setColumnMapping({ ...columnMapping, firstName: e.target.value })}
                        className="w-full mt-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="">(Optional)</option>
                        {csvHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Last Name:</span>
                      <select
                        value={columnMapping.lastName}
                        onChange={e => setColumnMapping({ ...columnMapping, lastName: e.target.value })}
                        className="w-full mt-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="">(Optional)</option>
                        {csvHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Company / Institute:</span>
                      <select
                        value={columnMapping.company}
                        onChange={e => setColumnMapping({ ...columnMapping, company: e.target.value })}
                        className="w-full mt-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="">(Optional)</option>
                        {csvHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {importResult && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    <span>
                      Successfully imported <strong>{importResult.imported}</strong> contacts! ({importResult.duplicates} duplicates merged)
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setShowCsvModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleExecuteImport}
                    disabled={importing}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md"
                  >
                    {importing ? 'Importing...' : 'Start Import'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewContact}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Add Subscriber Contact
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newContactEmail}
                  onChange={e => setNewContactEmail(e.target.value)}
                  placeholder="subscriber@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    value={newContactFirstName}
                    onChange={e => setNewContactFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    value={newContactLastName}
                    onChange={e => setNewContactLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Company</label>
                <input
                  type="text"
                  value={newContactCompany}
                  onChange={e => setNewContactCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD LIST MODAL */}
      {showAddListModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewList}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Create Contact List
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  List Name *
                </label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  placeholder="e.g. Enterprise Leads Q3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  value={newListDesc}
                  onChange={e => setNewListDesc(e.target.value)}
                  placeholder="Target audience description..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddListModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md"
              >
                Create List
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
