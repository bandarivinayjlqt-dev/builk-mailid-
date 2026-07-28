import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Contact,
  ContactList,
  EmailTemplate,
  Campaign,
  QueueJob,
  SMTPConfig,
  DeliverabilityMetrics,
  AuditLog,
} from '../types';

interface AppContextType {
  contacts: Contact[];
  contactLists: ContactList[];
  templates: EmailTemplate[];
  campaigns: Campaign[];
  queueJobs: QueueJob[];
  smtpConfigs: SMTPConfig[];
  deliverabilityData: DeliverabilityMetrics;
  auditLogs: AuditLog[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addContact: (contact: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  createContactList: (name: string, description?: string, tags?: string[]) => Promise<ContactList>;
  importContactsCSV: (listId: string, items: any[]) => Promise<{ importedCount: number; duplicatesCount: number }>;
  deduplicateContacts: () => Promise<number>;
  saveTemplate: (template: Partial<EmailTemplate>) => Promise<EmailTemplate>;
  createCampaign: (campaign: Partial<Campaign>) => Promise<Campaign>;
  sendCampaignNow: (campaignId: string) => Promise<void>;
  pauseCampaign: (campaignId: string) => Promise<void>;
  testSendEmail: (
    campaignId: string,
    email: string,
    firstName?: string,
    course?: string
  ) => Promise<{ parsedSubject: string; parsedBody: string }>;
  analyzeSpamScore: (
    subject: string,
    bodyText: string
  ) => Promise<{ spamScore: number; foundTriggers: string[]; recommendation: string }>;
  updateSMTPConfig: (config: Partial<SMTPConfig>) => Promise<SMTPConfig>;
  triggerNextQueueJob: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [queueJobs, setQueueJobs] = useState<QueueJob[]>([]);
  const [smtpConfigs, setSmtpConfigs] = useState<SMTPConfig[]>([]);
  const [deliverabilityData, setDeliverabilityData] = useState<DeliverabilityMetrics>({
    domain: 'mailpulse.io',
    healthScore: 98.4,
    spfStatus: true,
    dkimStatus: true,
    dmarcStatus: true,
    mxStatus: true,
    blacklistsFound: 0,
    spamScoreAverage: 0.8,
    ipWarmupDay: 12,
    ipWarmupProgress: 78,
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [resC, resL, resT, resCmp, resQ, resS, resD, resA] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/contacts/lists'),
        fetch('/api/templates'),
        fetch('/api/campaigns'),
        fetch('/api/queue'),
        fetch('/api/admin/smtp'),
        fetch('/api/deliverability'),
        fetch('/api/admin/audit-logs'),
      ]);

      const dataC = await resC.json();
      const dataL = await resL.json();
      const dataT = await resT.json();
      const dataCmp = await resCmp.json();
      const dataQ = await resQ.json();
      const dataS = await resS.json();
      const dataD = await resD.json();
      const dataA = await resA.json();

      setContacts(dataC.contacts || []);
      setContactLists(dataL.lists || []);
      setTemplates(dataT.templates || []);
      setCampaigns(dataCmp.campaigns || []);
      setQueueJobs(dataQ.jobs || []);
      setSmtpConfigs(dataS.smtpConfigs || []);
      if (dataD.metrics) setDeliverabilityData(dataD.metrics);
      setAuditLogs(dataA.auditLogs || []);
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live queue simulator ticker for active sending campaigns
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prevCamps => {
        const hasSending = prevCamps.some(c => c.status === 'sending');
        if (!hasSending) return prevCamps;

        return prevCamps.map(c => {
          if (c.status === 'sending') {
            const increment = Math.floor(Math.random() * 15) + 5;
            const newSent = Math.min(c.totalRecipients, c.sentCount + increment);
            const newDelivered = Math.min(newSent, c.deliveredCount + Math.floor(increment * 0.98));
            const newOpens = c.opensCount + Math.floor(increment * 0.55);
            const newClicks = c.clicksCount + Math.floor(increment * 0.22);
            const isFinished = newSent >= c.totalRecipients;

            return {
              ...c,
              sentCount: newSent,
              deliveredCount: newDelivered,
              opensCount: newOpens,
              uniqueOpensCount: Math.floor(newOpens * 0.88),
              clicksCount: newClicks,
              uniqueClicksCount: Math.floor(newClicks * 0.85),
              status: isFinished ? 'sent' : 'sending',
            };
          }
          return c;
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const addContact = async (contactData: Partial<Contact>): Promise<Contact> => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const newContact = await res.json();
    setContacts(prev => [newContact, ...prev]);
    refreshData();
    return newContact;
  };

  const deleteContact = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    setContacts(prev => prev.filter(c => c.id !== id));
    refreshData();
  };

  const createContactList = async (
    name: string,
    description?: string,
    tags: string[] = []
  ): Promise<ContactList> => {
    const res = await fetch('/api/contacts/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, tags }),
    });
    const newList = await res.json();
    setContactLists(prev => [newList, ...prev]);
    return newList;
  };

  const importContactsCSV = async (
    listId: string,
    items: any[]
  ): Promise<{ importedCount: number; duplicatesCount: number }> => {
    const res = await fetch('/api/contacts/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, items }),
    });
    const data = await res.json();
    await refreshData();
    return { importedCount: data.importedCount, duplicatesCount: data.duplicatesCount };
  };

  const deduplicateContacts = async (): Promise<number> => {
    const res = await fetch('/api/contacts/deduplicate', { method: 'POST' });
    const data = await res.json();
    await refreshData();
    return data.duplicatesRemoved;
  };

  const saveTemplate = async (templateData: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const isUpdate = !!templateData.id;
    const url = isUpdate ? `/api/templates/${templateData.id}` : '/api/templates';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    });
    const saved = await res.json();
    await refreshData();
    return saved;
  };

  const createCampaign = async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    });
    const created = await res.json();
    await refreshData();
    return created;
  };

  const sendCampaignNow = async (campaignId: string) => {
    await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
    await refreshData();
  };

  const pauseCampaign = async (campaignId: string) => {
    await fetch(`/api/campaigns/${campaignId}/pause`, { method: 'POST' });
    await refreshData();
  };

  const testSendEmail = async (
    campaignId: string,
    testEmail: string,
    recipientFirstName?: string,
    recipientCourse?: string
  ) => {
    const res = await fetch(`/api/campaigns/${campaignId}/test-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testEmail, recipientFirstName, recipientCourse }),
    });
    return await res.json();
  };

  const analyzeSpamScore = async (subject: string, bodyText: string) => {
    const res = await fetch('/api/deliverability/spam-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, bodyText }),
    });
    return await res.json();
  };

  const updateSMTPConfig = async (configData: Partial<SMTPConfig>): Promise<SMTPConfig> => {
    const res = await fetch('/api/admin/smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData),
    });
    const updated = await res.json();
    await refreshData();
    return updated;
  };

  const triggerNextQueueJob = async () => {
    await fetch('/api/queue/process-next', { method: 'POST' });
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        contacts,
        contactLists,
        templates,
        campaigns,
        queueJobs,
        smtpConfigs,
        deliverabilityData,
        auditLogs,
        loading,
        refreshData,
        addContact,
        deleteContact,
        createContactList,
        importContactsCSV,
        deduplicateContacts,
        saveTemplate,
        createCampaign,
        sendCampaignNow,
        pauseCampaign,
        testSendEmail,
        analyzeSpamScore,
        updateSMTPConfig,
        triggerNextQueueJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
