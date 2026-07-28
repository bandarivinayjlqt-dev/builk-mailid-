import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { sendEmailViaSES } from './src/ses.js';

// ES Module dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Mock In-Memory Database State ---
let users = [
  {
    id: 'usr_admin',
    name: 'Sarah Connor',
    email: 'admin@mailpulse.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'active',
    company: 'Apex Marketing Corp',
    emailVerified: true,
    quotaLimit: 500000,
    quotaUsed: 142850,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'usr_manager',
    name: 'Alex Rivera',
    email: 'alex@marketing.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'active',
    company: 'EduLearn Institute',
    emailVerified: true,
    quotaLimit: 100000,
    quotaUsed: 38400,
    createdAt: '2025-03-10T10:30:00Z',
  },
  {
    id: 'usr_marketer',
    name: 'David Kim',
    email: 'david@saascorp.com',
    role: 'marketer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'active',
    company: 'TechFlow SaaS',
    emailVerified: true,
    quotaLimit: 50000,
    quotaUsed: 12500,
    createdAt: '2025-05-01T14:20:00Z',
  }
];

let contactLists = [
  {
    id: 'list_1',
    name: 'Enterprise Software Leads',
    description: 'Verified decision makers in SaaS & IT sector',
    contactCount: 1420,
    tags: ['VIP', 'B2B', 'Tech'],
    createdAt: '2025-06-01T09:00:00Z'
  },
  {
    id: 'list_2',
    name: 'EduLearn Course Graduates',
    description: 'Students who completed Full-Stack & Cloud Bootcamps',
    contactCount: 850,
    tags: ['Education', 'Alumni'],
    createdAt: '2025-06-12T11:15:00Z'
  },
  {
    id: 'list_3',
    name: 'Monthly Newsletter Subscribers',
    description: 'Opted-in blog readers and product updates list',
    contactCount: 3240,
    tags: ['Newsletter', 'Organic'],
    createdAt: '2025-01-20T16:00:00Z'
  },
  {
    id: 'list_4',
    name: 'Q3 Webinar Attendees',
    description: 'Registrants for Cloud Deliverability & Scaling AI Webinar',
    contactCount: 620,
    tags: ['Webinar', 'Leads'],
    createdAt: '2025-07-02T13:45:00Z'
  }
];

let contacts = [
  {
    id: 'cnt_101',
    email: 'johndoe@acmecorp.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corp',
    course: 'Full-Stack Web Dev',
    tags: ['VIP', 'Tech'],
    status: 'active',
    listIds: ['list_1', 'list_3'],
    createdAt: '2025-06-02T10:00:00Z',
    lastEngagedAt: '2026-07-20T14:30:00Z',
    opensCount: 14,
    clicksCount: 5
  },
  {
    id: 'cnt_102',
    email: 'emily.watson@cloudscale.io',
    firstName: 'Emily',
    lastName: 'Watson',
    phone: '+1 (555) 876-5432',
    company: 'CloudScale Inc',
    course: 'AWS Cloud DevOps',
    tags: ['VIP', 'B2B'],
    status: 'active',
    listIds: ['list_1', 'list_4'],
    createdAt: '2025-06-03T11:20:00Z',
    lastEngagedAt: '2026-07-25T09:12:00Z',
    opensCount: 22,
    clicksCount: 9
  },
  {
    id: 'cnt_103',
    email: 'michael.brown@mit.edu',
    firstName: 'Michael',
    lastName: 'Brown',
    phone: '+1 (555) 345-6789',
    company: 'MIT Edu',
    course: 'Cybersecurity Masterclass',
    tags: ['Education', 'Alumni'],
    status: 'active',
    listIds: ['list_2'],
    createdAt: '2025-06-15T08:30:00Z',
    lastEngagedAt: '2026-07-22T18:05:00Z',
    opensCount: 8,
    clicksCount: 3
  },
  {
    id: 'cnt_104',
    email: 'robert.smith@invalid-bounce-test.com',
    firstName: 'Robert',
    lastName: 'Smith',
    phone: '+1 (555) 999-0000',
    company: 'Legacy Corp',
    course: 'Data Science 101',
    tags: ['B2B'],
    status: 'bounced',
    listIds: ['list_1'],
    createdAt: '2025-06-20T12:00:00Z',
    lastEngagedAt: undefined,
    opensCount: 0,
    clicksCount: 0
  },
  {
    id: 'cnt_105',
    email: 'lisa.taylor@optout-sample.org',
    firstName: 'Lisa',
    lastName: 'Taylor',
    phone: '+1 (555) 444-1122',
    company: 'Global Non-Profit',
    course: 'Digital Marketing',
    tags: ['Organic'],
    status: 'unsubscribed',
    listIds: ['list_3'],
    createdAt: '2025-01-22T09:00:00Z',
    lastEngagedAt: '2025-04-10T11:00:00Z',
    opensCount: 2,
    clicksCount: 0
  },
  {
    id: 'cnt_106',
    email: 'alexander.wright@fintech.co',
    firstName: 'Alexander',
    lastName: 'Wright',
    phone: '+1 (555) 123-9876',
    company: 'Fintech Solutions',
    course: 'Full-Stack Web Dev',
    tags: ['B2B', 'Tech', 'VIP'],
    status: 'active',
    listIds: ['list_1', 'list_2', 'list_3'],
    createdAt: '2025-06-10T15:00:00Z',
    lastEngagedAt: '2026-07-26T16:45:00Z',
    opensCount: 31,
    clicksCount: 12
  }
];

let templates = [
  {
    id: 'tpl_welcome',
    name: 'SaaS Welcome & Onboarding',
    description: 'Warm modern onboarding template with dynamic variable tags and CTA button',
    category: 'welcome',
    isPreset: true,
    updatedAt: '2026-07-01T12:00:00Z',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        content: { title: 'Welcome to MailPulse, {{first_name}}! 🚀', align: 'center', backgroundColor: '#4f46e5', textColor: '#ffffff' }
      },
      {
        id: 'b2',
        type: 'text',
        content: { text: 'Hi {{first_name}},\n\nWe are excited to have you join {{company}}! Your registration for {{course}} has been successfully processed.\n\nHere are 3 quick tips to get started with high deliverability email marketing:', align: 'left' }
      },
      {
        id: 'b3',
        type: 'button',
        content: { buttonText: 'Explore Your Dashboard', buttonUrl: 'https://mailpulse.io/dashboard', buttonBgColor: '#4f46e5', buttonTextColor: '#ffffff', align: 'center' }
      },
      {
        id: 'b4',
        type: 'unsubscribe_footer',
        content: { text: 'You received this email because you registered at Acme Corp. 123 Tech Blvd, Suite 400, San Francisco, CA.\nIf you no longer wish to receive these updates, you can unsubscribe below.' }
      }
    ],
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Welcome to MailPulse, {{first_name}}! 🚀</h1>
      </div>
      <div style="padding: 24px; color: #374151; line-height: 1.6;">
        <p>Hi {{first_name}},</p>
        <p>We are excited to have you join <strong>{{company}}</strong>! Your registration for <strong>{{course}}</strong> has been successfully confirmed.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mailpulse.io/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Explore Your Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        MailPulse Inc. 123 Tech Blvd, Suite 400, San Francisco, CA.<br/>
        <a href="{{unsubscribe_url}}" style="color: #4f46e5;">Unsubscribe from future emails</a>
      </div>
    </div>`,
    textContent: `Hi {{first_name}},\n\nWelcome to {{company}}! Your registration for {{course}} is confirmed.\n\nAccess dashboard: https://mailpulse.io/dashboard\n\nUnsubscribe: {{unsubscribe_url}}`
  },
  {
    id: 'tpl_newsletter',
    name: 'Tech & Product Monthly Update',
    description: 'Clean two-column newsletter template with feature highlights & social footer',
    category: 'newsletter',
    isPreset: true,
    updatedAt: '2026-07-15T14:20:00Z',
    blocks: [
      {
        id: 'bn1',
        type: 'header',
        content: { title: 'MailPulse Monthly Pulse: July Edition ⚡', align: 'center', backgroundColor: '#0f172a', textColor: '#ffffff' }
      },
      {
        id: 'bn2',
        type: 'text',
        content: { text: 'Hello {{first_name}},\n\nHere are the top product updates, deliverability benchmarks, and AI tools we launched this month.', align: 'left' }
      },
      {
        id: 'bn3',
        type: 'columns',
        content: { columnTexts: ['✨ AI Subject Line Generator\nBoost opens by 35% using real-time spam scoring.', '🛡️ Automated DMARC Auditor\nKeep sender domain health at 99.8% across Amazon SES.'] }
      },
      {
        id: 'bn4',
        type: 'button',
        content: { buttonText: 'Read Full Release Notes', buttonUrl: 'https://mailpulse.io/blog/july-updates', buttonBgColor: '#0284c7', buttonTextColor: '#ffffff', align: 'center' }
      },
      {
        id: 'bn5',
        type: 'unsubscribe_footer',
        content: { text: 'MailPulse SaaS Platform. All rights reserved.\nClick here to {{unsubscribe_url}}' }
      }
    ],
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px;">MailPulse Monthly Pulse ⚡</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>Hello {{first_name}},</p>
        <p>Check out our top July deliverability upgrades and AI campaign optimizations!</p>
        <table width="100%" cellpadding="10" cellspacing="0" style="margin: 20px 0;">
          <tr>
            <td width="50%" style="background-color: #f1f5f9; border-radius: 6px; vertical-align: top;">
              <strong style="color: #0284c7;">✨ AI Subject Line Scoring</strong>
              <p style="font-size: 13px; margin-top: 6px;">Instantly detect spam trigger words before sending.</p>
            </td>
            <td width="50%" style="background-color: #f1f5f9; border-radius: 6px; vertical-align: top;">
              <strong style="color: #0284c7;">🛡️ DMARC & SPF Auditor</strong>
              <p style="font-size: 13px; margin-top: 6px;">Maintain 99.8% inbox placement on Amazon SES.</p>
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://mailpulse.io/blog" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Read Full Release Notes</a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <a href="{{unsubscribe_url}}" style="color: #0284c7;">Unsubscribe</a> | MailPulse SaaS
      </div>
    </div>`,
    textContent: `MailPulse Monthly Pulse\n\nHello {{first_name}},\nRead full blog: https://mailpulse.io/blog\nUnsubscribe: {{unsubscribe_url}}`
  }
];

let campaigns = [
  {
    id: 'cmp_201',
    name: 'Q3 Enterprise AI Product Launch',
    subject: 'Introducing MailPulse AI: Send 50k Emails with 99.8% Inbox Rate',
    preheader: 'See live Amazon SES benchmarks and automated warm-up tools.',
    senderName: 'Sarah Connor',
    senderEmail: 'sarah@mailpulse.io',
    replyTo: 'support@mailpulse.io',
    templateId: 'tpl_newsletter',
    htmlContent: '<h1>Introducing MailPulse AI</h1><p>Hi {{first_name}}, scale your outreach with permission-based bulk email tools.</p>',
    textContent: 'Hi {{first_name}}, scale your outreach with permission-based bulk email tools.',
    listIds: ['list_1', 'list_4'],
    status: 'sent',
    type: 'standard',
    scheduledAt: '2026-07-20T08:00:00Z',
    sentAt: '2026-07-20T08:01:15Z',
    totalRecipients: 2040,
    sentCount: 2040,
    deliveredCount: 2018,
    opensCount: 1284,
    uniqueOpensCount: 1140,
    clicksCount: 482,
    uniqueClicksCount: 410,
    bounceCount: 22,
    complaintCount: 1,
    unsubscribeCount: 6,
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'cmp_202',
    name: 'EduLearn Bootcamp Graduate Special',
    subject: 'Exclusive {{course}} Refresher & Alumni Certificate',
    preheader: 'Claim your official digital badge and career workshop access.',
    senderName: 'EduLearn Team',
    senderEmail: 'alumni@edulearn.org',
    replyTo: 'alumni@edulearn.org',
    templateId: 'tpl_welcome',
    htmlContent: '<h1>Alumni Update</h1><p>Dear {{first_name}}, congratulation on completing {{course}}!</p>',
    textContent: 'Dear {{first_name}}, congratulations on completing {{course}}!',
    listIds: ['list_2'],
    status: 'sending',
    type: 'standard',
    scheduledAt: '2026-07-27T09:00:00Z',
    sentAt: '2026-07-27T09:00:05Z',
    totalRecipients: 850,
    sentCount: 620,
    deliveredCount: 614,
    opensCount: 310,
    uniqueOpensCount: 295,
    clicksCount: 112,
    uniqueClicksCount: 98,
    bounceCount: 6,
    complaintCount: 0,
    unsubscribeCount: 2,
    createdAt: '2026-07-26T14:30:00Z'
  },
  {
    id: 'cmp_203',
    name: 'August Deliverability Webinar Invitation',
    subject: 'A/B Testing: Subject Line A vs B - Live Workshop',
    preheader: 'Reserve your virtual seat before spots fill up.',
    senderName: 'David Kim',
    senderEmail: 'david@saascorp.com',
    replyTo: 'david@saascorp.com',
    templateId: 'tpl_welcome',
    htmlContent: '<h1>Join our Live Webinar</h1><p>Hi {{first_name}}, learn deliverability secrets!</p>',
    textContent: 'Hi {{first_name}}, learn deliverability secrets!',
    listIds: ['list_1', 'list_3'],
    status: 'scheduled',
    type: 'ab_test',
    scheduledAt: '2026-08-01T15:00:00Z',
    sentAt: undefined,
    totalRecipients: 4660,
    sentCount: 0,
    deliveredCount: 0,
    opensCount: 0,
    uniqueOpensCount: 0,
    clicksCount: 0,
    uniqueClicksCount: 0,
    bounceCount: 0,
    complaintCount: 0,
    unsubscribeCount: 0,
    abTest: {
      enabled: true,
      subjectLineB: '🔥 Quick question about your {{company}} email deliverability...',
      sampleSizePercent: 20,
      winningMetric: 'opens'
    },
    createdAt: '2026-07-27T08:15:00Z'
  }
];

let queueJobs: import('./src/types').QueueJob[] = [
  {
    id: 'job_8801',
    campaignId: 'cmp_202',
    campaignName: 'EduLearn Bootcamp Graduate Special',
    recipientEmail: 'johndoe@acmecorp.com',
    recipientName: 'John Doe',
    status: 'sent',
    attempts: 1,
    maxAttempts: 3,
    provider: 'amazon_ses',
    sentAt: '2026-07-27T09:28:10Z'
  },
  {
    id: 'job_8802',
    campaignId: 'cmp_202',
    campaignName: 'EduLearn Bootcamp Graduate Special',
    recipientEmail: 'emily.watson@cloudscale.io',
    recipientName: 'Emily Watson',
    status: 'sending',
    attempts: 1,
    maxAttempts: 3,
    provider: 'amazon_ses'
  },
  {
    id: 'job_8803',
    campaignId: 'cmp_202',
    campaignName: 'EduLearn Bootcamp Graduate Special',
    recipientEmail: 'michael.brown@mit.edu',
    recipientName: 'Michael Brown',
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    provider: 'amazon_ses'
  },
  {
    id: 'job_8804',
    campaignId: 'cmp_202',
    campaignName: 'EduLearn Bootcamp Graduate Special',
    recipientEmail: 'alexander.wright@fintech.co',
    recipientName: 'Alexander Wright',
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    provider: 'amazon_ses'
  }
];

let smtpConfigs = [
  {
    id: 'smtp_ses',
    provider: 'amazon_ses',
    apiKey: 'AKIAIOSFODNN7EXAMPLE_SECRET',
    region: 'us-east-1',
    fromDomain: 'mailpulse.io',
    sendingLimitPerSec: 14,
    dailyQuota: 50000,
    dailyUsed: 12450,
    isActive: true,
    spfVerified: true,
    dkimVerified: true,
    dmarcVerified: true
  },
  {
    id: 'smtp_sendgrid',
    provider: 'sendgrid',
    apiKey: 'SG.eK9x8L_EXAMPLE_KEY',
    fromDomain: 'mailpulse-backup.com',
    sendingLimitPerSec: 25,
    dailyQuota: 25000,
    dailyUsed: 1200,
    isActive: false,
    spfVerified: true,
    dkimVerified: true,
    dmarcVerified: false
  },
  {
    id: 'smtp_brevo',
    provider: 'brevo',
    apiKey: 'xkeysib-928372example_key',
    fromDomain: 'edulearn.org',
    sendingLimitPerSec: 10,
    dailyQuota: 10000,
    dailyUsed: 620,
    isActive: true,
    spfVerified: true,
    dkimVerified: true,
    dmarcVerified: true
  }
];

let deliverabilityData = {
  domain: 'mailpulse.io',
  healthScore: 98.4,
  spfStatus: true,
  dkimStatus: true,
  dmarcStatus: true,
  mxStatus: true,
  blacklistsFound: 0,
  spamScoreAverage: 0.8,
  ipWarmupDay: 12,
  ipWarmupProgress: 78
};

let auditLogs = [
  {
    id: 'log_1',
    userId: 'usr_admin',
    userName: 'Sarah Connor',
    action: 'CAMPAIGN_STARTED',
    details: 'Initiated dispatch for "EduLearn Bootcamp Graduate Special" (850 recipients)',
    ipAddress: '192.168.1.45',
    timestamp: '2026-07-27T09:00:05Z'
  },
  {
    id: 'log_2',
    userId: 'usr_admin',
    userName: 'Sarah Connor',
    action: 'CONTACTS_IMPORTED',
    details: 'Imported 1,420 contacts into list "Enterprise Software Leads"',
    ipAddress: '192.168.1.45',
    timestamp: '2026-07-26T14:10:00Z'
  },
  {
    id: 'log_3',
    userId: 'usr_manager',
    userName: 'Alex Rivera',
    action: 'SMTP_CONFIG_UPDATED',
    details: 'Verified DKIM & SPF records for Amazon SES (us-east-1)',
    ipAddress: '10.0.0.12',
    timestamp: '2026-07-25T11:00:00Z'
  }
];

// --- REST API ENDPOINTS ---

// 1. Auth API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  return res.json({
    token: `jwt_session_token_${user.id}_${Date.now()}`,
    user
  });
});

app.post('/api/auth/google', (req, res) => {
  const user = users[0]; // Admin Sarah
  return res.json({
    token: `jwt_google_auth_${user.id}_${Date.now()}`,
    user
  });
});

app.get('/api/auth/me', (req, res) => {
  return res.json({ user: users[0] });
});

// 2. Contacts & Lists API
app.get('/api/contacts', (req, res) => {
  const { search, listId, status, tag } = req.query;
  let filtered = [...contacts];

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(c =>
      c.email.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  }

  if (listId && listId !== 'all') {
    filtered = filtered.filter(c => c.listIds.includes(listId as string));
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(c => c.status === status);
  }

  if (tag && tag !== 'all') {
    filtered = filtered.filter(c => c.tags.includes(tag as string));
  }

  return res.json({ contacts: filtered, total: filtered.length });
});

app.post('/api/contacts', (req, res) => {
  const newContact = {
    id: `cnt_${Date.now()}`,
    email: req.body.email,
    firstName: req.body.firstName || 'Friend',
    lastName: req.body.lastName || '',
    phone: req.body.phone || '',
    company: req.body.company || '',
    course: req.body.course || '',
    tags: req.body.tags || ['Organic'],
    status: 'active',
    listIds: req.body.listIds || ['list_3'],
    createdAt: new Date().toISOString(),
    opensCount: 0,
    clicksCount: 0
  };
  contacts.unshift(newContact as any);

  // Update contact count in lists
  newContact.listIds.forEach(lid => {
    const lst = contactLists.find(l => l.id === lid);
    if (lst) lst.contactCount += 1;
  });

  return res.status(201).json(newContact);
});

app.delete('/api/contacts/:id', (req, res) => {
  const idx = contacts.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    const removed = contacts.splice(idx, 1)[0];
    removed.listIds.forEach(lid => {
      const lst = contactLists.find(l => l.id === lid);
      if (lst && lst.contactCount > 0) lst.contactCount -= 1;
    });
    return res.json({ success: true, id: req.params.id });
  }
  return res.status(404).json({ error: 'Contact not found' });
});

app.get('/api/contacts/lists', (req, res) => {
  return res.json({ lists: contactLists });
});

app.post('/api/contacts/lists', (req, res) => {
  const newList = {
    id: `list_${Date.now()}`,
    name: req.body.name,
    description: req.body.description || '',
    contactCount: 0,
    tags: req.body.tags || [],
    createdAt: new Date().toISOString()
  };
  contactLists.unshift(newList);
  return res.status(201).json(newList);
});

app.post('/api/contacts/import', (req, res) => {
  const { listId, items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid CSV format' });
  }

  let importedCount = 0;
  let duplicatesCount = 0;

  items.forEach((item: any) => {
    if (!item.email) return;
    const existing = contacts.find(c => c.email.toLowerCase() === item.email.toLowerCase());
    if (existing) {
      if (listId && !existing.listIds.includes(listId)) {
        existing.listIds.push(listId);
      }
      duplicatesCount++;
    } else {
      const created = {
        id: `cnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        email: item.email,
        firstName: item.firstName || item.first_name || 'Subscriber',
        lastName: item.lastName || item.last_name || '',
        phone: item.phone || '',
        company: item.company || '',
        course: item.course || '',
        tags: item.tags ? (Array.isArray(item.tags) ? item.tags : [item.tags]) : ['Imported'],
        status: 'active',
        listIds: listId ? [listId] : ['list_3'],
        createdAt: new Date().toISOString(),
        opensCount: 0,
        clicksCount: 0
      };
      contacts.unshift(created as any);
      importedCount++;
    }
  });

  const lst = contactLists.find(l => l.id === listId);
  if (lst) {
    lst.contactCount += importedCount;
  }

  // Add audit log
  auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: 'usr_admin',
    userName: 'Sarah Connor',
    action: 'CONTACTS_IMPORTED',
    details: `Imported ${importedCount} new contacts (${duplicatesCount} existing updated)`,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  return res.json({ success: true, importedCount, duplicatesCount, totalContacts: contacts.length });
});

app.post('/api/contacts/deduplicate', (req, res) => {
  const emailMap = new Map();
  let duplicatesRemoved = 0;

  const uniqueContacts: typeof contacts = [];
  contacts.forEach(c => {
    const key = c.email.toLowerCase().trim();
    if (emailMap.has(key)) {
      duplicatesRemoved++;
    } else {
      emailMap.set(key, true);
      uniqueContacts.push(c);
    }
  });

  contacts = uniqueContacts;
  return res.json({ success: true, duplicatesRemoved, totalRemaining: contacts.length });
});

// 3. Templates API
app.get('/api/templates', (req, res) => {
  return res.json({ templates });
});

app.post('/api/templates', (req, res) => {
  const newTpl = {
    id: `tpl_${Date.now()}`,
    name: req.body.name || 'Untitled Template',
    description: req.body.description || 'Custom email layout',
    category: req.body.category || 'newsletter',
    blocks: req.body.blocks || [],
    htmlContent: req.body.htmlContent || '<div>New Email Template</div>',
    textContent: req.body.textContent || 'New Email Template',
    isPreset: false,
    updatedAt: new Date().toISOString()
  };
  templates.unshift(newTpl as any);
  return res.status(201).json(newTpl);
});

app.put('/api/templates/:id', (req, res) => {
  const idx = templates.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    templates[idx] = {
      ...templates[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    return res.json(templates[idx]);
  }
  return res.status(404).json({ error: 'Template not found' });
});

// 4. Campaigns API
app.get('/api/campaigns', (req, res) => {
  return res.json({ campaigns });
});

app.post('/api/campaigns', (req, res) => {
  // Estimate total recipients based on listIds
  const targetListIds: string[] = req.body.listIds || [];
  const recipientCount = contacts.filter(c =>
    c.status === 'active' && c.listIds.some(lid => targetListIds.includes(lid))
  ).length || 1500;

  const newCamp = {
    id: `cmp_${Date.now()}`,
    name: req.body.name || 'New Campaign',
    subject: req.body.subject || 'Special Update from {{company}}',
    preheader: req.body.preheader || '',
    senderName: req.body.senderName || 'Sarah Connor',
    senderEmail: req.body.senderEmail || 'sarah@mailpulse.io',
    replyTo: req.body.replyTo || 'support@mailpulse.io',
    templateId: req.body.templateId,
    htmlContent: req.body.htmlContent || '<p>Hello {{first_name}},</p>',
    textContent: req.body.textContent || 'Hello {{first_name}},',
    listIds: targetListIds,
    status: req.body.scheduledAt ? 'scheduled' : 'draft',
    type: req.body.type || 'standard',
    scheduledAt: req.body.scheduledAt,
    totalRecipients: recipientCount,
    sentCount: 0,
    deliveredCount: 0,
    opensCount: 0,
    uniqueOpensCount: 0,
    clicksCount: 0,
    uniqueClicksCount: 0,
    bounceCount: 0,
    complaintCount: 0,
    unsubscribeCount: 0,
    abTest: req.body.abTest,
    createdAt: new Date().toISOString()
  };

  campaigns.unshift(newCamp as any);

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: 'usr_admin',
    userName: 'Sarah Connor',
    action: 'CAMPAIGN_CREATED',
    details: `Created campaign "${newCamp.name}" (${newCamp.totalRecipients} targeted)`,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  return res.status(201).json(newCamp);
});

app.post('/api/campaigns/:id/send', (req, res) => {
  const camp = campaigns.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });

  camp.status = 'sending';
  camp.sentAt = new Date().toISOString();

  // Create queue jobs
  const targetContacts = contacts.filter(c =>
    c.status === 'active' && (camp.listIds.length === 0 || c.listIds.some(l => camp.listIds.includes(l)))
  );

  const sampleTargets = targetContacts.length > 0 ? targetContacts : contacts.slice(0, 10);

  sampleTargets.forEach((c, idx) => {
    queueJobs.unshift({
      id: `job_${Date.now()}_${idx}`,
      campaignId: camp.id,
      campaignName: camp.name,
      recipientEmail: c.email,
      recipientName: `${c.firstName} ${c.lastName}`.trim(),
      status: 'queued',
      attempts: 0,
      maxAttempts: 3,
      provider: 'amazon_ses',
      sentAt: undefined
    });
  });

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: 'usr_admin',
    userName: 'Sarah Connor',
    action: 'CAMPAIGN_DISPATCHED',
    details: `Dispatched campaign "${camp.name}" to queue engine`,
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  return res.json({ success: true, campaign: camp, queueCount: sampleTargets.length });
});

app.post('/api/campaigns/:id/pause', (req, res) => {
  const camp = campaigns.find(c => c.id === req.params.id);
  if (camp) {
    camp.status = 'paused';
    return res.json({ success: true, campaign: camp });
  }
  return res.status(404).json({ error: 'Campaign not found' });
});

app.post('/api/campaigns/:id/test-send', async (req, res) => {
  const { testEmail, recipientFirstName, recipientCourse } = req.body;
  const camp = campaigns.find(c => c.id === req.params.id);

  const parsedSubject = (camp?.subject || 'Test Email')
    .replace(/\{\{first_name\}\}/g, recipientFirstName || 'Valued Recipient')
    .replace(/\{\{course\}\}/g, recipientCourse || 'Full-Stack Engineering')
    .replace(/\{\{company\}\}/g, 'Acme Corp');

  const parsedBody = (camp?.htmlContent || '<p>Test email body</p>')
    .replace(/\{\{first_name\}\}/g, recipientFirstName || 'Valued Recipient')
    .replace(/\{\{course\}\}/g, recipientCourse || 'Full-Stack Engineering')
    .replace(/\{\{company\}\}/g, 'Acme Corp')
    .replace(/\{\{unsubscribe_url\}\}/g, 'https://mailpulse.io/unsubscribe?token=sample_test');

  const target = testEmail || 'user@example.com';
  const result = await sendEmailViaSES(target, parsedSubject, parsedBody);

  return res.json({
    success: result.success,
    sentTo: target,
    parsedSubject,
    parsedBody,
    deliveredAt: new Date().toISOString(),
    sesMessageId: result.messageId,
    sesError: result.error
  });
});

// 5. Queue Engine API
app.get('/api/queue', (req, res) => {
  return res.json({
    jobs: queueJobs,
    activeWorkers: 4,
    queueBacklog: queueJobs.filter(j => j.status === 'queued').length,
    sendingRatePerSec: 14,
    provider: 'Amazon SES (us-east-1)'
  });
});

app.post('/api/queue/process-next', async (req, res) => {
  const queuedJob = queueJobs.find(j => j.status === 'queued');
  if (queuedJob) {
    queuedJob.status = 'sending';
    queuedJob.attempts += 1;

    const camp = campaigns.find(c => c.id === queuedJob.campaignId);
    const subject = camp?.subject || 'Message from MailPulse';
    const body = camp?.htmlContent || '<p></p>';

    const result = await sendEmailViaSES(queuedJob.recipientEmail, subject, body);

    if (result.success) {
      queuedJob.status = 'sent';
      queuedJob.sentAt = new Date().toISOString();
      if (camp) {
        camp.sentCount += 1;
        camp.deliveredCount += 1;
      }
    } else {
      queuedJob.status = queuedJob.attempts >= queuedJob.maxAttempts ? 'failed' : 'queued';
      queuedJob.error = result.error;
    }

    return res.json({ processedJob: queuedJob });
  }
  return res.json({ message: 'Queue is clear' });
});

// 6. Deliverability & DNS API
app.get('/api/deliverability', (req, res) => {
  return res.json({
    metrics: deliverabilityData,
    dnsRecords: [
      { type: 'TXT', name: 'mailpulse.io', value: 'v=spf1 include:amazonses.com ~all', status: 'verified' },
      { type: 'CNAME', name: 'ses._domainkey.mailpulse.io', value: 'dkim.amazonses.com', status: 'verified' },
      { type: 'TXT', name: '_dmarc.mailpulse.io', value: 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@mailpulse.io', status: 'verified' }
    ]
  });
});

app.post('/api/deliverability/spam-score', (req, res) => {
  const { subject, bodyText } = req.body;
  const content = `${subject || ''} ${bodyText || ''}`.toLowerCase();

  let score = 0;
  const triggerWords = ['free money', 'guaranteed', '100% free', 'buy now', 'act fast', 'click here now', 'crypto investment', 'no risk', 'cash bonus'];
  const foundTriggers: string[] = [];

  triggerWords.forEach(word => {
    if (content.includes(word)) {
      score += 1.5;
      foundTriggers.push(word);
    }
  });

  if (subject && subject === subject.toUpperCase() && subject.length > 5) {
    score += 2.0;
    foundTriggers.push('ALL_CAPS_SUBJECT');
  }

  const recommendation = score < 2.0
    ? 'Excellent! Low risk of spam filters.'
    : score < 4.0
    ? 'Moderate risk. Consider removing words like: ' + foundTriggers.join(', ')
    : 'High spam risk! Revise promotional keywords immediately.';

  return res.json({ spamScore: Math.min(score, 10), foundTriggers, recommendation });
});

// 7. Analytics API
app.get('/api/analytics/overview', (req, res) => {
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalOpens = campaigns.reduce((acc, c) => acc + c.opensCount, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicksCount, 0);
  const totalBounces = campaigns.reduce((acc, c) => acc + c.bounceCount, 0);
  const totalUnsubscribes = campaigns.reduce((acc, c) => acc + c.unsubscribeCount, 0);

  const openRate = totalDelivered > 0 ? ((totalOpens / totalDelivered) * 100).toFixed(1) : '0';
  const clickRate = totalDelivered > 0 ? ((totalClicks / totalDelivered) * 100).toFixed(1) : '0';
  const bounceRate = totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) : '0';

  const hourlyTrend = [
    { hour: '08:00', sent: 400, opens: 210, clicks: 82 },
    { hour: '10:00', sent: 650, opens: 380, clicks: 145 },
    { hour: '12:00', sent: 820, opens: 510, clicks: 210 },
    { hour: '14:00', sent: 950, opens: 620, clicks: 275 },
    { hour: '16:00', sent: 1100, opens: 740, clicks: 310 },
    { hour: '18:00', sent: 1250, opens: 810, clicks: 350 },
  ];

  const deviceBreakdown = [
    { name: 'Desktop (Chrome & Outlook)', count: 1240, percentage: 58 },
    { name: 'Mobile (Apple Mail & Gmail)', count: 720, percentage: 34 },
    { name: 'Tablet (iPadOS)', count: 170, percentage: 8 },
  ];

  const geoStats = [
    { country: 'United States', code: 'US', opens: 950, percentage: 44 },
    { country: 'United Kingdom', code: 'GB', opens: 380, percentage: 18 },
    { country: 'Germany', code: 'DE', opens: 260, percentage: 12 },
    { country: 'India', code: 'IN', opens: 240, percentage: 11 },
    { country: 'Canada', code: 'CA', opens: 180, percentage: 8 },
    { country: 'Australia', code: 'AU', opens: 150, percentage: 7 },
  ];

  return res.json({
    summary: {
      totalSent,
      totalDelivered,
      totalOpens,
      totalClicks,
      totalBounces,
      totalUnsubscribes,
      openRate: `${openRate}%`,
      clickRate: `${clickRate}%`,
      bounceRate: `${bounceRate}%`
    },
    hourlyTrend,
    deviceBreakdown,
    geoStats
  });
});

// 8. Admin & SMTP API
app.get('/api/admin/users', (req, res) => {
  return res.json({ users });
});

app.get('/api/admin/smtp', (req, res) => {
  return res.json({ smtpConfigs });
});

app.post('/api/admin/smtp', (req, res) => {
  const { provider, apiKey, region, fromDomain } = req.body;
  const existing = smtpConfigs.find(s => s.provider === provider);
  if (existing) {
    existing.apiKey = apiKey || existing.apiKey;
    existing.region = region || existing.region;
    existing.fromDomain = fromDomain || existing.fromDomain;
    return res.json(existing);
  } else {
    const created = {
      id: `smtp_${Date.now()}`,
      provider: provider || 'amazon_ses',
      apiKey: apiKey || 'AKIA_KEY_SAMPLE',
      region: region || 'us-east-1',
      fromDomain: fromDomain || 'mycompany.com',
      sendingLimitPerSec: 14,
      dailyQuota: 50000,
      dailyUsed: 0,
      isActive: true,
      spfVerified: true,
      dkimVerified: true,
      dmarcVerified: true
    };
    smtpConfigs.push(created);
    return res.status(201).json(created);
  }
});

app.get('/api/admin/audit-logs', (req, res) => {
  return res.json({ auditLogs });
});

app.get('/api/admin/system-metrics', (req, res) => {
  return res.json({
    cpuUsage: 14.2,
    memoryUsageMb: 248,
    queueBacklog: queueJobs.filter(j => j.status === 'queued').length,
    activeWorkers: 4,
    currentSendingRateSec: 14,
    smtpStatus: 'operational'
  });
});

// --- Server & Vite Setup ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MailPulse Bulk Email SaaS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
