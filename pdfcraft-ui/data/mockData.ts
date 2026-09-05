import { Template, SavedTemplate, Blueprint, IntegrationApp, WebhookEndpoint, UserProfile, BillingDetails, InvoiceRecord } from '../types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida/AEtjO1UbRzPD3ig_zYChhPkvvCdNyJkK-g_SL_QXm7KBgRLuK4ROpVwZKxoY8dVgV7sKL_a3Amk-0mynPDuRceMoUXmtrGC4NsrKM-hGLhaKssN4iDKEs38p0wGlj2fP-kZtv07UwglxeB63e62Od9wfc9JvibzIJKygxYP_WSyKzVFyc4yuwf3UdKhOKOF89PdRS2RLgkDI4I7QNPh1h3vG-LELXvZCx_69s0HH3H-WCsE8GqpUZMc7OHbYJ2Y";

export const AVATAR_URL = "https://lh3.googleusercontent.com/aida/AEtjO1XhX6jR94xXUGk9E2bguTa7HkZ8T_R46MS1pqGM-Tn1CtIK4WJ10Gwkc2Bt3iK3-RVbfyb2sPFtsoE8h0morwfuLrSZmQcDWtKu6MeAIS4z0jsDZJaqTusn7f_rdzPGRIy3QVwpbmr43voIcp4Uv3exf9Z4vrYP4GTMUkIIgPLHV-_XVE9AS_WuH7xHgdkkkflCrpU8_3SrJknSSIaCnmG-9IeK-JjB210WTr8yIkF-Unks8y3cWQp6z3M";

export const INITIAL_USER: UserProfile = {
  name: "Elena Vance",
  email: "elena@pdfcraft.io",
  role: "Workspace Owner",
  avatar: AVATAR_URL,
  jobTitle: "Lead Product Engineer",
  timezone: "UTC-07:00 (Pacific Time)",
  is2faActive: true,
  googleConnected: true,
  githubConnected: true,
  ssoConfigured: false,
};

export const INITIAL_BILLING: BillingDetails = {
  planName: "Pro Developer Plan",
  priceMonthly: 79,
  billingCycle: "Annual",
  renewalDate: "Nov 14, 2025",
  workspaceId: "ws_live_9942a1",
  quotaUsed: 42890,
  quotaTotal: 100000,
  resetDate: "Dec 1, 2024",
};

export const INITIAL_MY_TEMPLATES: Template[] = [
  {
    id: "tmpl_1",
    title: "Commercial Tax Inv...",
    description: "Automated EU & US cross-border VAT",
    version: "v3.2",
    status: "Active",
    variables: ["{{invoice_id}}", "{{items_table}}", "{{vat_total}}"],
    renders: "18.4k",
    updatedAt: "2h ago",
    previewType: "invoice",
    category: "Invoices",
  },
  {
    id: "tmpl_2",
    title: "SaaS B2B Service A...",
    description: "Standard master licensing contract",
    version: "v1.8",
    status: "Active",
    variables: ["{{company_name}}", "{{term_months}}", "{{sign_date}}"],
    renders: "9.2k",
    updatedAt: "1d ago",
    previewType: "contract",
    category: "Contracts",
  },
  {
    id: "tmpl_3",
    title: "Shipping Slip & Barc...",
    description: "Thermal ready 400dpi print standard",
    version: "v2.1",
    status: "Active",
    variables: ["{{tracking_no}}", "{{qr_matrix}}", "{{weight_kg}}"],
    renders: "31.1k",
    updatedAt: "3d ago",
    previewType: "shipping",
    category: "Shipping",
  },
  {
    id: "tmpl_4",
    title: "Employee Offer Letter",
    description: "Automated equity & compensation clauses",
    version: "v0.9",
    status: "Draft",
    variables: ["{{candidate_name}}", "{{base_salary}}", "{{equity_units}}"],
    renders: "142",
    updatedAt: "5d ago",
    previewType: "letter",
    category: "Contracts",
  },
];

export const INITIAL_SAVED_TEMPLATES: SavedTemplate[] = [
  {
    id: "saved_1",
    title: "Standard Packing Slip",
    subtitle: "Logistics & Inventory Hub",
    monthlyRenders: "4.2k monthly renders",
    variables: ["{{order_lines}}", "{{sku_count}}"],
    previewType: "packing",
  },
  {
    id: "saved_2",
    title: "Event Ticket & QR Badge",
    subtitle: "Conferences & Access Pass",
    monthlyRenders: "12.1k monthly renders",
    variables: ["{{attendee_qr}}", "{{gate_zone}}"],
    previewType: "ticket",
  },
  {
    id: "saved_3",
    title: "Quarterly Financial Summary",
    subtitle: "Board Deck & Audit Ready",
    monthlyRenders: "890 monthly renders",
    variables: ["{{ebitda_calc}}", "{{revenue_arr}}"],
    previewType: "financial",
  },
];

export const INITIAL_BLUEPRINTS: Blueprint[] = [
  {
    id: "bp_1",
    title: "Modern Minimal Invoice (EU/US)",
    description: "Crisp typographic invoice template with dynamic itemized...",
    verifiedBy: "PdfCraft Official",
    rating: 4.9,
    reviewCount: 248,
    tags: ["EN 16931 compliant", "Clean CSS"],
    workspaceClones: "14.6k workspace clones",
    previewVariant: "invoice",
  },
  {
    id: "bp_2",
    title: "Freelance Contract & Scope",
    description: "Standard contractor IP assignment, payment...",
    verifiedBy: "Stripe Verified",
    rating: 4.8,
    reviewCount: 189,
    tags: ["DocuSign anchor tags", "Legal Standard"],
    workspaceClones: "9.3k workspace clones",
    previewVariant: "contract",
  },
  {
    id: "bp_3",
    title: "E-commerce Delivery Note",
    description: "Optimized for warehouse picking systems with automate...",
    verifiedBy: "DocuSign Team",
    rating: 5.0,
    reviewCount: 412,
    tags: ["Barcode 128 + PDF417", "High Speed"],
    workspaceClones: "18.1k workspace clones",
    previewVariant: "delivery",
  },
  {
    id: "bp_4",
    title: "ISO Compliant Certificate",
    description: "Formal completion certificate with vector foil seals, verificati...",
    verifiedBy: "PdfCraft Official",
    rating: 4.7,
    reviewCount: 94,
    tags: ["Security Seals", "Vector Assets"],
    workspaceClones: "7.8k workspace clones",
    previewVariant: "certificate",
  },
];

export const INITIAL_INTEGRATIONS: IntegrationApp[] = [
  {
    id: "zapier",
    name: "Zapier",
    tagline: "Trigger via 5,000+ connectors",
    description: "Trigger automated PDF rendering from form submissions, invoices, and CRM records directly into PdfCraft placeholders with zero code.",
    status: "Connected",
    features: ["Instant Webhooks", "2-Way Field Mapping", "Auto-Retry on 5xx"],
    hasListeningToggle: true,
    isListening: true,
    actionLabel: "Configure",
  },
  {
    id: "make",
    name: "Make (Integromat)",
    tagline: "Complex branching scenarios",
    description: "Build visual multi-step scenarios, transform raw dynamic JSON arrays into tables, and receive signed direct PDF download URLs.",
    status: "Connected",
    features: ["Visual Scenarios", "Binary Stream Output", "Batch Rendering"],
    instanceInfo: "Scenario #4092 Active",
    actionLabel: "Configure Mappings",
  },
  {
    id: "bubble",
    name: "Bubble",
    tagline: "Official no-code plugin",
    description: "Render dynamic client-facing documents directly from Bubble workflows. Supports repeating group extraction and client-side token authorization.",
    status: "Connected / Active",
    badgeColor: "success",
    features: ["Custom Workflow Actions", "Repeating Group Sync", "Direct PDF Download"],
    instanceInfo: "Plugin v2.1 Installed",
    actionLabel: "Manage Plugin",
  },
  {
    id: "n8n",
    name: "n8n (Self-Hosted / Cloud)",
    tagline: "Node for fair-code workflows",
    description: "Fair-code node for on-premise infrastructure or private cloud nodes with unlimited payload streaming and automated token renewal.",
    status: "Connected",
    monthlyRenders: "12,410 Renders / mo",
    features: ["Zero Payload Cap", "Custom Auth Headers", "Auto Backoff"],
    instanceInfo: "Instance: n8n.internal.corp",
    actionLabel: "Configure Node",
  },
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "wh_1",
    eventTrigger: "render.completed",
    endpointUrl: "https://api.acmecorp.com/webhooks/pdfc...",
    secretKey: "whsec_••••••••8819",
    statusText: "99.9% (200 OK)",
    statusSuccess: true,
    lastPing: "Just now",
  },
  {
    id: "wh_2",
    eventTrigger: "render.failed",
    endpointUrl: "https://ops-pager.internal.net/alerts/...",
    secretKey: "whsec_••••••••4122",
    statusText: "100% (200 OK)",
    statusSuccess: true,
    lastPing: "12m ago",
  },
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: "#INV-2024-1002",
    billingDate: "Nov 14, 2024",
    amount: "$79.00 USD",
    period: "Nov 14, 2024 – Dec 14, 2024",
    status: "Paid",
  },
  {
    id: "#INV-2024-0901",
    billingDate: "Oct 14, 2024",
    amount: "$79.00 USD",
    period: "Oct 14, 2024 – Nov 14, 2024",
    status: "Paid",
  },
  {
    id: "#INV-2024-0801",
    billingDate: "Sep 14, 2024",
    amount: "$79.00 USD",
    period: "Sep 14, 2024 – Oct 14, 2024",
    status: "Paid",
  },
];
