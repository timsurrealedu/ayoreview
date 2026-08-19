export type User = {
  id: string;
  email: string;
  name: string;
  is_platform_admin?: boolean;
  created_at: string;
};

export type OrganizationPlan = 'pilot' | 'starter' | 'business' | 'enterprise';
export type OrganizationStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';

export type Organization = {
  id: string;
  name: string;
  owner_user_id: string;
  plan: OrganizationPlan;
  status: OrganizationStatus;
  created_at: string;
  updated_at: string;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
};

export type Business = {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Location = {
  id: string;
  business_id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  google_maps_url: string | null;
  google_review_url: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type CardPlacement = 
  | 'cashier' 
  | 'table' 
  | 'entrance' 
  | 'counter' 
  | 'receipt' 
  | 'waiting_area' 
  | 'custom';

export type CardStatus = 'active' | 'inactive' | 'lost' | 'replaced';

export type Card = {
  id: string;
  location_id: string | null;
  public_id: string;
  inventory_code: string;
  name: string;
  placement: CardPlacement;
  status: CardStatus;
  created_at: string;
  updated_at: string;
};

export type InteractionSource = 'qr' | 'nfc' | 'direct';
export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';

export type Interaction = {
  id: string;
  card_id: string;
  source: InteractionSource;
  timestamp: string;
  is_bot: number; // 0 or 1
  user_agent: string | null;
  ip_hash: string | null;
  device_type: DeviceType;
};

export type AnalyticsOverview = {
  today: number;
  last7Days: number;
  last30Days: number;
  allTime: number;
  qrTotal: number;
  nfcTotal: number;
  qrPercentage: number;
  nfcPercentage: number;
  todayGrowthPct: number;
};

export type DailyTrendPoint = {
  date: string; // YYYY-MM-DD
  total: number;
  qr: number;
  nfc: number;
};

export type CardWithStats = Card & {
  location_name?: string;
  business_name?: string;
  google_review_url?: string;
  stats: {
    today: number;
    last7Days: number;
    last30Days: number;
    allTime: number;
    qr: number;
    nfc: number;
  };
};

export type LocationWithStats = Location & {
  business_name?: string;
  card_count: number;
  active_card_count: number;
  total_interactions: number;
};
