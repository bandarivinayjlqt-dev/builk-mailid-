export type UserRole = 'admin' | 'manager' | 'marketer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  company?: string;
  emailVerified: boolean;
  quotaLimit: number;
  quotaUsed: number;
  createdAt: string;
}

export type ContactStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';

export interface Contact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  course?: string;
  tags: string[];
  status: ContactStatus;
  listIds: string[];
  customFields?: Record<string, string>;
  createdAt: string;
  lastEngagedAt?: string;
  opensCount: number;
  clicksCount: number;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  tags: string[];
  createdAt: string;
}

export type BlockType =
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'social'
  | 'unsubscribe_footer'
  | 'columns';

export interface TemplateBlock {
  id: string;
  type: BlockType;
  content: {
    title?: string;
    text?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    align?: 'left' | 'center' | 'right';
    padding?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    socialLinks?: { platform: string; url: string }[];
    columnTexts?: [string, string];
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'newsletter' | 'promotional' | 'educational' | 'transactional' | 'welcome';
  blocks: TemplateBlock[];
  htmlContent: string;
  textContent: string;
  isPreset?: boolean;
  updatedAt: string;
}

export interface ABTestConfig {
  enabled: boolean;
  subjectLineB?: string;
  sampleSizePercent: number;
  winningMetric: 'opens' | 'clicks';
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  templateId?: string;
  htmlContent: string;
  textContent: string;
  listIds: string[];
  status: CampaignStatus;
  type: 'standard' | 'ab_test' | 'automated';
  scheduledAt?: string;
  sentAt?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  opensCount: number;
  uniqueOpensCount: number;
  clicksCount: number;
  uniqueClicksCount: number;
  bounceCount: number;
  complaintCount: number;
  unsubscribeCount: number;
  abTest?: ABTestConfig;
  createdAt: string;
}

export interface QueueJob {
  id: string;
  campaignId: string;
  campaignName: string;
  recipientEmail: string;
  recipientName: string;
  status: 'queued' | 'sending' | 'sent' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  provider: 'amazon_ses' | 'sendgrid' | 'brevo';
  sentAt?: string;
  error?: string;
}

export interface SMTPConfig {
  id: string;
  provider: 'amazon_ses' | 'sendgrid' | 'brevo' | 'custom_smtp';
  apiKey: string;
  region?: string;
  fromDomain: string;
  sendingLimitPerSec: number;
  dailyQuota: number;
  dailyUsed: number;
  isActive: boolean;
  spfVerified: boolean;
  dkimVerified: boolean;
  dmarcVerified: boolean;
}

export interface DeliverabilityMetrics {
  domain: string;
  healthScore: number;
  spfStatus: boolean;
  dkimStatus: boolean;
  dmarcStatus: boolean;
  mxStatus: boolean;
  blacklistsFound: number;
  spamScoreAverage: number;
  ipWarmupDay: number;
  ipWarmupProgress: number;
}

export interface HourlyStat {
  hour: string;
  sent: number;
  opens: number;
  clicks: number;
}

export interface DeviceStat {
  name: string;
  count: number;
  percentage: number;
}

export interface TopLinkStat {
  url: string;
  label: string;
  clicks: number;
}

export interface GeoStat {
  country: string;
  code: string;
  opens: number;
  percentage: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  hourlyStats: HourlyStat[];
  deviceBreakdown: DeviceStat[];
  topLinks: TopLinkStat[];
  geoStats: GeoStat[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemMetric {
  cpuUsage: number;
  memoryUsageMb: number;
  queueBacklog: number;
  activeWorkers: number;
  currentSendingRateSec: number;
  smtpStatus: 'operational' | 'degraded' | 'offline';
}
