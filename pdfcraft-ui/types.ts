export type TemplateStatus = 'Active' | 'Draft' | 'Archived';

export interface Template {
  id: string;
  title: string;
  description: string;
  version: string;
  status: TemplateStatus;
  variables: string[];
  renders: string;
  updatedAt: string;
  previewType: 'invoice' | 'contract' | 'shipping' | 'letter';
  category: 'Invoices' | 'Contracts' | 'Certificates' | 'Shipping' | 'Reports';
  isPinned?: boolean;
}

export interface SavedTemplate {
  id: string;
  title: string;
  subtitle: string;
  monthlyRenders: string;
  variables: string[];
  previewType: 'packing' | 'ticket' | 'financial';
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  verifiedBy: 'PdfCraft Official' | 'Stripe Verified' | 'DocuSign Team';
  rating: number;
  reviewCount: number;
  tags: string[];
  workspaceClones: string;
  previewVariant: 'invoice' | 'contract' | 'delivery' | 'certificate';
}

export interface IntegrationApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Connected' | 'Connected / Active';
  badgeColor?: string;
  features: string[];
  hasListeningToggle?: boolean;
  isListening?: boolean;
  instanceInfo?: string;
  monthlyRenders?: string;
  actionLabel: string;
}

export interface WebhookEndpoint {
  id: string;
  eventTrigger: 'render.completed' | 'render.failed' | 'template.updated';
  endpointUrl: string;
  secretKey: string;
  statusText: string;
  statusSuccess: boolean;
  lastPing: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  jobTitle: string;
  timezone: string;
  is2faActive: boolean;
  googleConnected: boolean;
  githubConnected: boolean;
  ssoConfigured: boolean;
}

export interface BillingDetails {
  planName: string;
  priceMonthly: number;
  billingCycle: 'Annual' | 'Monthly';
  renewalDate: string;
  workspaceId: string;
  quotaUsed: number;
  quotaTotal: number;
  resetDate: string;
}

export interface InvoiceRecord {
  id: string;
  billingDate: string;
  amount: string;
  period: string;
  status: 'Paid' | 'Pending' | 'Failed';
}
