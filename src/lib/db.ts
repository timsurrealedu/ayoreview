import { getAdminClient } from './supabase/admin';
import { 
  User, Organization, Business, Location, Card, Interaction, 
  AnalyticsOverview, DailyTrendPoint, CardWithStats, LocationWithStats,
  CardPlacement, CardStatus, InteractionSource
} from './types';
import { nanoid } from 'nanoid';
import { validateGoogleReviewUrl, validateGoogleMapsUrl } from './url-validator';

export const dbRepo = {
  // -------------------------------------------------------------
  // Users & Organizations
  // -------------------------------------------------------------
  async getUserById(id: string): Promise<User | null> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return data as User | null;
  },

  async getAllUsers(): Promise<User[]> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return (data || []) as User[];
  },

  async getOrganization(orgId?: string): Promise<Organization | null> {
    const supabase = getAdminClient();
    if (orgId) {
      const { data } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();
      return data as Organization | null;
    }

    const { data } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    return data as Organization | null;
  },

  async getAllOrganizations(): Promise<Organization[]> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    return (data || []) as Organization[];
  },

  async updateOrganizationPlan(id: string, plan: string, status: string): Promise<void> {
    const supabase = getAdminClient();
    await supabase
      .from('organizations')
      .update({ plan, status, updated_at: new Date().toISOString() })
      .eq('id', id);
  },

  async getUserOrganizations(userId: string): Promise<Array<{ organization: Organization; role: 'owner' | 'admin' | 'member' }>> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('organization_members')
      .select('role, organizations (*)')
      .eq('user_id', userId);

    if (!data) return [];
    return data
      .filter((row: any) => Boolean(row.organizations))
      .map((row: any) => ({
        organization: row.organizations as Organization,
        role: row.role as 'owner' | 'admin' | 'member',
      }));
  },

  async createOrganization(name: string, ownerUserId: string): Promise<Organization> {
    const supabase = getAdminClient();
    const orgId = 'org_' + nanoid(10);
    const now = new Date().toISOString();

    const { data: org, error } = await supabase
      .from('organizations')
      .insert({
        id: orgId,
        name,
        owner_user_id: ownerUserId,
        plan: 'pilot',
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('organization_members').insert({
      id: 'mem_' + nanoid(10),
      organization_id: orgId,
      user_id: ownerUserId,
      role: 'owner',
      created_at: now,
    });

    return org as Organization;
  },

  // -------------------------------------------------------------
  // Businesses
  // -------------------------------------------------------------
  async getBusinesses(orgId: string): Promise<Business[]> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('organization_id', orgId)
      .is('archived_at', null)
      .order('created_at', { ascending: true });
    return (data || []) as Business[];
  },

  async getBusinessById(id: string, orgId?: string): Promise<Business | null> {
    const supabase = getAdminClient();
    let query = supabase.from('businesses').select('*').eq('id', id).is('archived_at', null);
    if (orgId) {
      query = query.eq('organization_id', orgId);
    }
    const { data } = await query.single();
    return data as Business | null;
  },

  async createBusiness(orgId: string, name: string, category: string, logoUrl?: string | null): Promise<Business> {
    const supabase = getAdminClient();
    const id = 'biz_' + nanoid(10);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        id,
        organization_id: orgId,
        name,
        category,
        logo_url: logoUrl || null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Business;
  },

  async updateBusiness(id: string, name: string, category: string, orgId?: string): Promise<void> {
    const supabase = getAdminClient();
    let query = supabase
      .from('businesses')
      .update({ name, category, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (orgId) {
      query = query.eq('organization_id', orgId);
    }
    await query;
  },

  // -------------------------------------------------------------
  // Locations
  // -------------------------------------------------------------
  async getLocations(businessId?: string, orgId?: string): Promise<Location[]> {
    const supabase = getAdminClient();
    let query = supabase.from('locations').select('*, businesses!inner(organization_id)');
    
    if (businessId) {
      query = query.eq('business_id', businessId);
    }
    if (orgId) {
      query = query.eq('businesses.organization_id', orgId);
    }

    const { data } = await query.order('created_at', { ascending: true });
    return (data || []).map((row: any) => {
      const { businesses, ...loc } = row;
      return loc as Location;
    });
  },

  async getLocationById(id: string, orgId?: string): Promise<Location | null> {
    const supabase = getAdminClient();
    let query = supabase.from('locations').select('*, businesses!inner(organization_id)').eq('id', id);
    if (orgId) {
      query = query.eq('businesses.organization_id', orgId);
    }
    const { data } = await query.single();
    if (!data) return null;
    const { businesses, ...loc } = data as any;
    return loc as Location;
  },

  async getLocationsWithStats(orgId: string): Promise<LocationWithStats[]> {
    const supabase = getAdminClient();
    const { data: locRows } = await supabase
      .from('locations')
      .select(`
        *,
        businesses!inner(id, name, organization_id),
        cards(id, status, interactions(id, is_bot))
      `)
      .eq('businesses.organization_id', orgId);

    if (!locRows) return [];

    return locRows.map((row: any) => {
      const cardsList = row.cards || [];
      const card_count = cardsList.length;
      const active_card_count = cardsList.filter((c: any) => c.status === 'active').length;
      
      let total_interactions = 0;
      cardsList.forEach((c: any) => {
        const ints = c.interactions || [];
        total_interactions += ints.filter((i: any) => i.is_bot === 0).length;
      });

      return {
        id: row.id,
        business_id: row.business_id,
        business_name: row.businesses?.name || '',
        name: row.name,
        address: row.address,
        city: row.city,
        country: row.country,
        google_maps_url: row.google_maps_url,
        google_review_url: row.google_review_url,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        card_count,
        active_card_count,
        total_interactions,
      };
    });
  },

  async createLocation(data: {
    business_id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    google_maps_url?: string | null;
    google_review_url: string;
  }): Promise<Location> {
    const reviewVal = validateGoogleReviewUrl(data.google_review_url);
    if (!reviewVal.isValid) {
      throw new Error(reviewVal.error || 'Invalid Google Review URL');
    }

    const mapsVal = validateGoogleMapsUrl(data.google_maps_url);
    if (!mapsVal.isValid) {
      throw new Error(mapsVal.error || 'Invalid Google Maps URL');
    }

    const supabase = getAdminClient();
    const id = 'loc_' + nanoid(10);
    const now = new Date().toISOString();

    const { data: loc, error } = await supabase
      .from('locations')
      .insert({
        id,
        business_id: data.business_id,
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        google_maps_url: mapsVal.sanitizedUrl || null,
        google_review_url: reviewVal.sanitizedUrl || data.google_review_url,
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return loc as Location;
  },

  async updateLocation(
    id: string,
    data: {
      name?: string;
      address?: string;
      city?: string;
      country?: string;
      google_maps_url?: string | null;
      google_review_url?: string;
      status?: 'active' | 'inactive';
    },
    orgId?: string
  ): Promise<void> {
    // PostgREST can't scope PATCH by joined tables, so org scoping is a
    // pre-check: without it the orgId param would silently do nothing.
    if (orgId !== undefined) {
      const existing = await this.getLocationById(id, orgId);
      if (!existing) throw new Error('Location not found');
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.city !== undefined) updatePayload.city = data.city;
    if (data.country !== undefined) updatePayload.country = data.country;
    if (data.status !== undefined) updatePayload.status = data.status;

    if (data.google_review_url !== undefined) {
      const reviewVal = validateGoogleReviewUrl(data.google_review_url);
      if (!reviewVal.isValid) {
        throw new Error(reviewVal.error || 'Invalid Google Review URL');
      }
      updatePayload.google_review_url = reviewVal.sanitizedUrl;
    }

    if (data.google_maps_url !== undefined) {
      const mapsVal = validateGoogleMapsUrl(data.google_maps_url);
      if (!mapsVal.isValid) {
        throw new Error(mapsVal.error || 'Invalid Google Maps URL');
      }
      updatePayload.google_maps_url = mapsVal.sanitizedUrl || null;
    }

    const supabase = getAdminClient();
    await supabase.from('locations').update(updatePayload).eq('id', id);
  },

  // -------------------------------------------------------------
  // Cards
  // -------------------------------------------------------------
  async getCards(options?: { locationId?: string; orgId?: string }): Promise<CardWithStats[]> {
    const supabase = getAdminClient();
    let query = supabase.from('cards').select(`
      *,
      locations (
        id,
        name,
        google_review_url,
        businesses (
          id,
          name,
          organization_id
        )
      ),
      interactions (
        id,
        source,
        timestamp,
        is_bot
      )
    `);

    if (options?.locationId) {
      query = query.eq('location_id', options.locationId);
    }

    const { data } = await query.order('created_at', { ascending: false });
    if (!data) return [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const d7Start = now.getTime() - 7 * 86400000;
    const d30Start = now.getTime() - 30 * 86400000;

    let results = data.map((c: any) => {
      const validInts = (c.interactions || []).filter((i: any) => i.is_bot === 0);
      let today = 0;
      let yesterday = 0;
      let last7Days = 0;
      let last30Days = 0;
      let qr = 0;
      let nfc = 0;

      validInts.forEach((i: any) => {
        const time = new Date(i.timestamp).getTime();
        if (time >= todayStart) today++;
        else if (time >= yesterdayStart) yesterday++;
        if (time >= d7Start) last7Days++;
        if (time >= d30Start) last30Days++;
        if (i.source === 'qr') qr++;
        if (i.source === 'nfc') nfc++;
      });

      return {
        id: c.id,
        location_id: c.location_id,
        public_id: c.public_id,
        inventory_code: c.inventory_code,
        name: c.name,
        placement: c.placement,
        status: c.status,
        created_at: c.created_at,
        updated_at: c.updated_at,
        location_name: c.locations?.name,
        google_review_url: c.locations?.google_review_url,
        business_name: c.locations?.businesses?.name,
        organization_id: c.locations?.businesses?.organization_id,
        stats: {
          today,
          yesterday,
          last7Days,
          last30Days,
          allTime: validInts.length,
          qr,
          nfc,
        },
      };
    });

    if (options?.orgId) {
      results = results.filter((c: any) => c.organization_id === options.orgId);
    }

    return results;
  },

  async getCardById(id: string, orgId?: string): Promise<CardWithStats | null> {
    const cards = await this.getCards(orgId ? { orgId } : undefined);
    return cards.find((c) => c.id === id) || null;
  },

  async getCardByPublicId(publicId: string): Promise<(Card & { google_review_url?: string; location_status?: string }) | null> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('cards')
      .select('*, locations(google_review_url, status)')
      .eq('public_id', publicId)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      location_id: data.location_id,
      public_id: data.public_id,
      inventory_code: data.inventory_code,
      name: data.name,
      placement: data.placement,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      google_review_url: (data as any).locations?.google_review_url,
      location_status: (data as any).locations?.status,
    };
  },

  async getCardByInventoryCode(code: string): Promise<Card | null> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('cards')
      .select('*')
      .eq('inventory_code', code)
      .single();
    return data as Card | null;
  },

  async createCard(data: {
    location_id: string | null;
    name: string;
    placement: CardPlacement;
    inventory_code?: string;
  }): Promise<Card> {
    const supabase = getAdminClient();
    const id = 'crd_' + nanoid(10);
    const publicId = nanoid(7).replace(/[^a-zA-Z0-9]/g, 'k');
    const invCode = data.inventory_code || 'RT-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    const { data: card, error } = await supabase
      .from('cards')
      .insert({
        id,
        location_id: data.location_id || null,
        public_id: publicId,
        inventory_code: invCode,
        name: data.name,
        placement: data.placement,
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return card as Card;
  },

  async updateCard(
    id: string,
    data: {
      name?: string;
      placement?: CardPlacement;
      status?: CardStatus;
      location_id?: string | null;
    },
    orgId?: string
  ): Promise<void> {
    if (orgId !== undefined) {
      const existing = await this.getCardById(id, orgId);
      if (!existing) throw new Error('Card not found');
    }
    const supabase = getAdminClient();
    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.placement !== undefined) updatePayload.placement = data.placement;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.location_id !== undefined) updatePayload.location_id = data.location_id;

    await supabase.from('cards').update(updatePayload).eq('id', id);
  },

  async replaceCard(oldCardId: string, newInventoryCode: string): Promise<Card | null> {
    const oldCard = await this.getCardById(oldCardId);
    if (!oldCard) return null;

    await this.updateCard(oldCardId, { status: 'replaced' });

    const existingNewCard = await this.getCardByInventoryCode(newInventoryCode);
    if (existingNewCard) {
      await this.updateCard(existingNewCard.id, {
        location_id: oldCard.location_id,
        name: oldCard.name + ' (Replacement)',
        placement: oldCard.placement,
        status: 'active',
      });
      return await this.getCardById(existingNewCard.id);
    }

    return await this.createCard({
      location_id: oldCard.location_id,
      name: oldCard.name + ' (Replacement)',
      placement: oldCard.placement,
      inventory_code: newInventoryCode,
    });
  },

  // -------------------------------------------------------------
  // Interactions & Analytics
  // -------------------------------------------------------------
  async recordInteraction(data: {
    card_id: string;
    source: InteractionSource;
    is_bot?: number;
    user_agent?: string | null;
    ip_hash?: string | null;
    device_type?: string;
  }): Promise<void> {
    const supabase = getAdminClient();
    const id = 'int_' + nanoid(12);
    const now = new Date().toISOString();

    await supabase.from('interactions').insert({
      id,
      card_id: data.card_id,
      source: data.source,
      timestamp: now,
      is_bot: data.is_bot || 0,
      user_agent: data.user_agent || null,
      ip_hash: data.ip_hash || null,
      device_type: data.device_type || 'unknown',
    });
  },

  async getAnalyticsOverview(orgId: string): Promise<AnalyticsOverview> {
    const cards = await this.getCards({ orgId });
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const d7Start = now.getTime() - 7 * 86400000;
    const d30Start = now.getTime() - 30 * 86400000;

    let today = 0;
    let yesterday = 0;
    let last7Days = 0;
    let last30Days = 0;
    let allTime = 0;
    let qrTotal = 0;
    let nfcTotal = 0;

    cards.forEach((c) => {
      today += c.stats.today;
      yesterday += c.stats.yesterday;
      last7Days += c.stats.last7Days;
      last30Days += c.stats.last30Days;
      allTime += c.stats.allTime;
      qrTotal += c.stats.qr;
      nfcTotal += c.stats.nfc;
    });

    const totalSources = qrTotal + nfcTotal || 1;
    const qrPercentage = Math.round((qrTotal / totalSources) * 100);
    const nfcPercentage = 100 - qrPercentage;
    const todayGrowthPct = Math.round(((today - yesterday) / (yesterday || 1)) * 100);

    return {
      today,
      last7Days,
      last30Days,
      allTime,
      qrTotal,
      nfcTotal,
      qrPercentage,
      nfcPercentage,
      todayGrowthPct,
    };
  },

  async getDailyTrend(orgId: string, days: number = 30): Promise<DailyTrendPoint[]> {
    const supabase = getAdminClient();
    const now = new Date();
    const dateMap = new Map<string, { total: number; qr: number; nfc: number }>();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      dateMap.set(dateStr, { total: 0, qr: 0, nfc: 0 });
    }

    const startDate = new Date(now.getTime() - days * 86400000).toISOString();

    const { data } = await supabase
      .from('interactions')
      .select('source, timestamp, cards!inner(locations!inner(businesses!inner(organization_id)))')
      .eq('is_bot', 0)
      .gte('timestamp', startDate)
      .eq('cards.locations.businesses.organization_id', orgId);

    if (data) {
      data.forEach((row: any) => {
        const dateStr = row.timestamp.slice(0, 10);
        const entry = dateMap.get(dateStr);
        if (entry) {
          entry.total++;
          if (row.source === 'qr') entry.qr++;
          if (row.source === 'nfc') entry.nfc++;
        }
      });
    }

    const points: DailyTrendPoint[] = [];
    dateMap.forEach((val, date) => {
      points.push({
        date,
        total: val.total,
        qr: val.qr,
        nfc: val.nfc,
      });
    });

    return points;
  },

  async getTopCards(orgId: string, limit: number = 5): Promise<CardWithStats[]> {
    const cards = await this.getCards({ orgId });
    return cards.sort((a, b) => b.stats.last30Days - a.stats.last30Days).slice(0, limit);
  },

  async getPlacementsBreakdown(orgId: string) {
    const cards = await this.getCards({ orgId });
    const map = new Map<CardPlacement, { interactions: number; card_count: number }>();

    cards.forEach((c) => {
      const current = map.get(c.placement) || { interactions: 0, card_count: 0 };
      current.interactions += c.stats.allTime;
      current.card_count += 1;
      map.set(c.placement, current);
    });

    const results: Array<{ placement: CardPlacement; interactions: number; card_count: number }> = [];
    map.forEach((val, key) => {
      results.push({
        placement: key,
        interactions: val.interactions,
        card_count: val.card_count,
      });
    });

    return results.sort((a, b) => b.interactions - a.interactions);
  },

  // -------------------------------------------------------------
  // Operator Admin Inventory & Metrics
  // -------------------------------------------------------------
  async getAllInventoryCards(): Promise<any[]> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('cards')
      .select(`
        *,
        locations (
          id,
          name,
          businesses (
            name
          )
        ),
        interactions (id, is_bot)
      `)
      .order('inventory_code', { ascending: true });

    if (!data) return [];

    return data.map((c: any) => ({
      ...c,
      location_name: c.locations?.name,
      business_name: c.locations?.businesses?.name,
      total_interactions: (c.interactions || []).filter((i: any) => i.is_bot === 0).length,
    }));
  },

  async getAllLocationsWithOrg(): Promise<any[]> {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from('locations')
      .select(`
        *,
        businesses (
          id,
          name,
          organization_id,
          organizations (
            id,
            name
          )
        )
      `)
      .order('name', { ascending: true });

    if (!data) return [];

    return data.map((row: any) => ({
      ...row,
      business_name: row.businesses?.name,
      organization_id: row.businesses?.organization_id,
      organization_name: row.businesses?.organizations?.name,
    }));
  },

  async batchGenerateBlankCards(count: number = 10): Promise<Card[]> {
    const supabase = getAdminClient();
    const { data: lastRows } = await supabase
      .from('cards')
      .select('inventory_code')
      .like('inventory_code', 'RT-%')
      .order('inventory_code', { ascending: false })
      .limit(1);

    let startNum = 100100;
    if (lastRows && lastRows.length > 0) {
      const match = lastRows[0].inventory_code.replace('RT-', '');
      const parsed = parseInt(match, 10);
      if (!isNaN(parsed)) startNum = parsed + 1;
    }

    // NOTE: Race condition — concurrent calls can derive overlapping ranges and
    // hit unique constraint on inventory_code. At pilot/admin-only scale this is
    // low risk. For production hardening, use a DB sequence or wrap in a retry loop.
    const created: Card[] = [];
    for (let i = 0; i < count; i++) {
      const code = 'RT-' + (startNum + i);
      const card = await this.createCard({
        location_id: null,
        name: 'Blank ' + code,
        placement: 'cashier',
        inventory_code: code,
      });
      created.push(card);
    }
    return created;
  },

  async getSystemOverview() {
    const supabase = getAdminClient();
    const [
      { count: orgCount },
      { count: bizCount },
      { count: locCount },
      { count: cardCount },
      { count: activeCardCount },
      { count: intCount },
    ] = await Promise.all([
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      supabase.from('businesses').select('*', { count: 'exact', head: true }).is('archived_at', null),
      supabase.from('locations').select('*', { count: 'exact', head: true }),
      supabase.from('cards').select('*', { count: 'exact', head: true }),
      supabase.from('cards').select('*', { count: 'exact', head: true }).eq('status', 'active').not('location_id', 'is', null),
      supabase.from('interactions').select('*', { count: 'exact', head: true }).eq('is_bot', 0),
    ]);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const { count: todayCount } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .eq('is_bot', 0)
      .gte('timestamp', todayStart);

    return {
      totalOrganizations: orgCount || 0,
      totalBusinesses: bizCount || 0,
      totalLocations: locCount || 0,
      totalCards: cardCount || 0,
      activeCards: activeCardCount || 0,
      totalInteractions: intCount || 0,
      todayInteractions: todayCount || 0,
    };
  },
};
