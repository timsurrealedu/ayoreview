import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { 
  User, Organization, Business, Location, Card, Interaction, 
  AnalyticsOverview, DailyTrendPoint, CardWithStats, LocationWithStats,
  CardPlacement, CardStatus, InteractionSource
} from './types';
import { nanoid } from 'nanoid';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'reviewtap.db');

// Singleton database instance
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
    seedInitialData(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_user_id TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'pilot',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'owner',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      logo_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      archived_at TEXT
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      google_maps_url TEXT,
      google_review_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      location_id TEXT,
      public_id TEXT UNIQUE NOT NULL,
      inventory_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      placement TEXT NOT NULL DEFAULT 'cashier',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      source TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      is_bot INTEGER NOT NULL DEFAULT 0,
      user_agent TEXT,
      ip_hash TEXT,
      device_type TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_cards_public_id ON cards(public_id);
    CREATE INDEX IF NOT EXISTS idx_cards_location ON cards(location_id);
    CREATE INDEX IF NOT EXISTS idx_cards_inventory ON cards(inventory_code);
    CREATE INDEX IF NOT EXISTS idx_interactions_card_time ON interactions(card_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp);
  `);
}

function seedInitialData(db: Database.Database) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  const now = new Date().toISOString();
  
  // Create default demo user
  const userId = 'usr_demo_01';
  db.prepare(`
    INSERT INTO users (id, email, name, created_at)
    VALUES (?, ?, ?, ?)
  `).run(userId, 'timothy@reviewtap.id', 'Timothy Surreal', now);

  // Create default demo organization
  const orgId = 'org_demo_01';
  db.prepare(`
    INSERT INTO organizations (id, name, owner_user_id, plan, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(orgId, 'Timothy Hospitality Group', userId, 'pilot', 'active', now, now);

  db.prepare(`
    INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run('mem_01', orgId, userId, 'owner', now);

  // Business 1: Kopi Contoh
  const biz1Id = 'biz_kopi_01';
  db.prepare(`
    INSERT INTO businesses (id, organization_id, name, category, logo_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(biz1Id, orgId, 'Kopi Contoh', 'Cafe & Specialty Coffee', null, now, now);

  // Location 1: Kemanggisan
  const loc1Id = 'loc_kemanggisan_01';
  db.prepare(`
    INSERT INTO locations (id, business_id, name, address, city, country, google_maps_url, google_review_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    loc1Id, 
    biz1Id, 
    'Kemanggisan Flagship', 
    'Jl. Kemanggisan Raya No. 12', 
    'Jakarta Barat', 
    'Indonesia', 
    'https://maps.google.com/?cid=123456789', 
    'https://g.page/r/example-kopi-kemanggisan/review', 
    'active', 
    now, 
    now
  );

  // Location 2: Pantai Indah Kapuk (PIK)
  const loc2Id = 'loc_pik_02';
  db.prepare(`
    INSERT INTO locations (id, business_id, name, address, city, country, google_maps_url, google_review_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    loc2Id, 
    biz1Id, 
    'PIK Avenue Branch', 
    'Ruko Golf Island Blok E No. 8', 
    'Jakarta Utara', 
    'Indonesia', 
    'https://maps.google.com/?cid=987654321', 
    'https://g.page/r/example-kopi-pik/review', 
    'active', 
    now, 
    now
  );

  // Cards for Kopi Contoh Kemanggisan
  const cards = [
    { id: 'crd_01', locId: loc1Id, pubId: 'a7Xk29', inv: 'RT-000101', name: 'Kasir 01 (Main POS)', placement: 'cashier' },
    { id: 'crd_02', locId: loc1Id, pubId: 'X8W91K', inv: 'RT-000102', name: 'Table 03 (Window Seat)', placement: 'table' },
    { id: 'crd_03', locId: loc1Id, pubId: 'M4P91Q', inv: 'RT-000103', name: 'Main Entrance Stand', placement: 'entrance' },
    { id: 'crd_04', locId: loc2Id, pubId: 'K9X2QM', inv: 'RT-000104', name: 'Barista Counter', placement: 'counter' },
    { id: 'crd_05', locId: loc2Id, pubId: 'P2N81Z', inv: 'RT-000105', name: 'Outdoor Lounge Table 1', placement: 'table' },
  ];

  const insertCard = db.prepare(`
    INSERT INTO cards (id, location_id, public_id, inventory_code, name, placement, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of cards) {
    insertCard.run(c.id, c.locId, c.pubId, c.inv, c.name, c.placement, 'active', now, now);
  }

  // Generate realistic 30-day interaction history
  const insertInteraction = db.prepare(`
    INSERT INTO interactions (id, card_id, source, timestamp, is_bot, user_agent, ip_hash, device_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sources: InteractionSource[] = ['qr', 'qr', 'qr', 'nfc', 'nfc']; // ~60% QR, 40% NFC
  const devices = ['mobile', 'mobile', 'mobile', 'mobile', 'tablet'];

  // 30 days back to today
  for (let d = 29; d >= 0; d--) {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - d);
    
    // Average 15-35 interactions per day
    const dayCount = Math.floor(18 + Math.sin(d / 3) * 8 + (29 - d) * 0.4 + Math.random() * 6);
    
    for (let i = 0; i < dayCount; i++) {
      const card = cards[Math.floor(Math.random() * cards.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      
      const hour = Math.floor(8 + Math.random() * 14); // 8am to 10pm
      const minute = Math.floor(Math.random() * 60);
      const sec = Math.floor(Math.random() * 60);
      const timestamp = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), hour, minute, sec).toISOString();
      
      insertInteraction.run(
        'int_' + nanoid(10),
        card.id,
        source,
        timestamp,
        0,
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        'ip_' + Math.floor(Math.random() * 99999),
        device
      );
    }
  }

  // Pre-generate 5 blank unassigned cards in physical inventory
  for (let i = 6; i <= 10; i++) {
    const invCode = 'RT-00010' + i;
    const pubId = nanoid(7).replace(/[^a-zA-Z0-9]/g, 'x');
    insertCard.run(
      'crd_blank_' + i,
      null,
      pubId,
      invCode,
      'Unassigned ' + invCode,
      'cashier',
      'active',
      now,
      now
    );
  }
}

// Data Access API

export const dbRepo = {
  // Organizations & Users
  getDemoUser(): User {
    const db = getDb();
    return db.prepare('SELECT * FROM users LIMIT 1').get() as User;
  },

  getOrganization(orgId?: string): Organization {
    const db = getDb();
    if (orgId) {
      return db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId) as Organization;
    }
    return db.prepare('SELECT * FROM organizations LIMIT 1').get() as Organization;
  },

  getAllOrganizations(): Organization[] {
    const db = getDb();
    return db.prepare('SELECT * FROM organizations ORDER BY created_at DESC').all() as Organization[];
  },

  updateOrganizationPlan(id: string, plan: string, status: string): void {
    const db = getDb();
    db.prepare('UPDATE organizations SET plan = ?, status = ?, updated_at = ? WHERE id = ?')
      .run(plan, status, new Date().toISOString(), id);
  },

  // Businesses
  getBusinesses(orgId: string): Business[] {
    const db = getDb();
    return db.prepare('SELECT * FROM businesses WHERE organization_id = ? AND archived_at IS NULL ORDER BY created_at ASC')
      .all(orgId) as Business[];
  },

  getBusinessById(id: string): Business | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM businesses WHERE id = ? AND archived_at IS NULL').get(id) as Business | undefined;
  },

  createBusiness(orgId: string, name: string, category: string, logoUrl?: string | null): Business {
    const db = getDb();
    const id = 'biz_' + nanoid(10);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO businesses (id, organization_id, name, category, logo_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, orgId, name, category, logoUrl || null, now, now);
    return this.getBusinessById(id)!;
  },

  updateBusiness(id: string, name: string, category: string): void {
    const db = getDb();
    db.prepare('UPDATE businesses SET name = ?, category = ?, updated_at = ? WHERE id = ?')
      .run(name, category, new Date().toISOString(), id);
  },

  // Locations
  getLocations(businessId?: string): Location[] {
    const db = getDb();
    if (businessId) {
      return db.prepare('SELECT * FROM locations WHERE business_id = ? ORDER BY created_at ASC')
        .all(businessId) as Location[];
    }
    return db.prepare('SELECT * FROM locations ORDER BY created_at ASC').all() as Location[];
  },

  getLocationById(id: string): Location | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM locations WHERE id = ?').get(id) as Location | undefined;
  },

  getLocationsWithStats(orgId: string): LocationWithStats[] {
    const db = getDb();
    const rows = db.prepare(`
      SELECT 
        l.*,
        b.name as business_name,
        COUNT(DISTINCT c.id) as card_count,
        SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) as active_card_count,
        COUNT(i.id) as total_interactions
      FROM locations l
      JOIN businesses b ON l.business_id = b.id
      LEFT JOIN cards c ON c.location_id = l.id
      LEFT JOIN interactions i ON i.card_id = c.id AND i.is_bot = 0
      WHERE b.organization_id = ? AND b.archived_at IS NULL
      GROUP BY l.id
      ORDER BY total_interactions DESC
    `).all(orgId) as any[];

    return rows.map((r) => ({
      ...r,
      card_count: Number(r.card_count || 0),
      active_card_count: Number(r.active_card_count || 0),
      total_interactions: Number(r.total_interactions || 0),
    }));
  },

  createLocation(data: {
    business_id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    google_maps_url?: string | null;
    google_review_url: string;
  }): Location {
    const db = getDb();
    const id = 'loc_' + nanoid(10);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO locations (id, business_id, name, address, city, country, google_maps_url, google_review_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(
      id,
      data.business_id,
      data.name,
      data.address,
      data.city,
      data.country,
      data.google_maps_url || null,
      data.google_review_url,
      now,
      now
    );
    return this.getLocationById(id)!;
  },

  updateLocation(
    id: string,
    data: {
      name?: string;
      address?: string;
      city?: string;
      country?: string;
      google_maps_url?: string | null;
      google_review_url?: string;
      status?: 'active' | 'inactive';
    }
  ): void {
    const db = getDb();
    const loc = this.getLocationById(id);
    if (!loc) return;
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE locations SET
        name = COALESCE(?, name),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        country = COALESCE(?, country),
        google_maps_url = COALESCE(?, google_maps_url),
        google_review_url = COALESCE(?, google_review_url),
        status = COALESCE(?, status),
        updated_at = ?
      WHERE id = ?
    `).run(
      data.name,
      data.address,
      data.city,
      data.country,
      data.google_maps_url,
      data.google_review_url,
      data.status,
      now,
      id
    );
  },

  // Cards
  getCards(options?: { locationId?: string; orgId?: string }): CardWithStats[] {
    const db = getDb();
    let query = `
      SELECT 
        c.*,
        l.name as location_name,
        l.google_review_url as google_review_url,
        b.name as business_name
      FROM cards c
      LEFT JOIN locations l ON c.location_id = l.id
      LEFT JOIN businesses b ON l.business_id = b.id
    `;
    const params: any[] = [];

    if (options?.locationId) {
      query += ` WHERE c.location_id = ?`;
      params.push(options.locationId);
    } else if (options?.orgId) {
      query += ` WHERE (b.organization_id = ? OR c.location_id IS NULL)`;
      params.push(options.orgId);
    }

    query += ` ORDER BY c.created_at DESC`;

    const cards = db.prepare(query).all(...params) as any[];

    // Attach statistics
    return cards.map((c) => {
      const stats = this.getCardStats(c.id);
      return {
        ...c,
        stats,
      };
    });
  },

  getCardById(id: string): CardWithStats | undefined {
    const db = getDb();
    const card = db.prepare(`
      SELECT 
        c.*,
        l.name as location_name,
        l.google_review_url as google_review_url,
        b.name as business_name
      FROM cards c
      LEFT JOIN locations l ON c.location_id = l.id
      LEFT JOIN businesses b ON l.business_id = b.id
      WHERE c.id = ?
    `).get(id) as any;

    if (!card) return undefined;
    const stats = this.getCardStats(card.id);
    return { ...card, stats };
  },

  getCardByPublicId(publicId: string): (Card & { google_review_url?: string; location_status?: string }) | undefined {
    const db = getDb();
    return db.prepare(`
      SELECT 
        c.*,
        l.google_review_url,
        l.status as location_status
      FROM cards c
      LEFT JOIN locations l ON c.location_id = l.id
      WHERE c.public_id = ?
    `).get(publicId) as any;
  },

  getCardByInventoryCode(code: string): Card | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM cards WHERE inventory_code = ?').get(code) as Card | undefined;
  },

  createCard(data: {
    location_id: string | null;
    name: string;
    placement: CardPlacement;
    inventory_code?: string;
  }): Card {
    const db = getDb();
    const id = 'crd_' + nanoid(10);
    const publicId = nanoid(7).replace(/[^a-zA-Z0-9]/g, 'k');
    const invCode = data.inventory_code || 'RT-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO cards (id, location_id, public_id, inventory_code, name, placement, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(id, data.location_id, publicId, invCode, data.name, data.placement, now, now);

    return this.getCardById(id)!;
  },

  updateCard(
    id: string,
    data: {
      name?: string;
      placement?: CardPlacement;
      status?: CardStatus;
      location_id?: string | null;
    }
  ): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE cards SET
        name = COALESCE(?, name),
        placement = COALESCE(?, placement),
        status = COALESCE(?, status),
        location_id = CASE WHEN ? = '__KEEP__' THEN location_id ELSE ? END,
        updated_at = ?
      WHERE id = ?
    `).run(
      data.name,
      data.placement,
      data.status,
      data.location_id === undefined ? '__KEEP__' : data.location_id,
      data.location_id,
      now,
      id
    );
  },

  replaceCard(oldCardId: string, newInventoryCode: string): Card | null {
    const db = getDb();
    const oldCard = this.getCardById(oldCardId);
    if (!oldCard) return null;

    // Mark old card as replaced
    this.updateCard(oldCardId, { status: 'replaced' });

    // Check if new inventory card already exists
    let newCard = this.getCardByInventoryCode(newInventoryCode);
    if (newCard) {
      this.updateCard(newCard.id, {
        location_id: oldCard.location_id,
        name: oldCard.name + ' (Replacement)',
        placement: oldCard.placement,
        status: 'active',
      });
      return this.getCardById(newCard.id)!;
    }

    // Otherwise create new card with this inventory code
    return this.createCard({
      location_id: oldCard.location_id,
      name: oldCard.name + ' (Replacement)',
      placement: oldCard.placement,
      inventory_code: newInventoryCode,
    });
  },

  // Interactions & Analytics
  recordInteraction(data: {
    card_id: string;
    source: InteractionSource;
    is_bot?: number;
    user_agent?: string | null;
    ip_hash?: string | null;
    device_type?: string;
  }): void {
    const db = getDb();
    const id = 'int_' + nanoid(12);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO interactions (id, card_id, source, timestamp, is_bot, user_agent, ip_hash, device_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.card_id,
      data.source,
      now,
      data.is_bot || 0,
      data.user_agent || null,
      data.ip_hash || null,
      data.device_type || 'unknown'
    );
  },

  getCardStats(cardId: string) {
    const db = getDb();
    const now = new Date();
    
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const d7Start = new Date(now.getTime() - 7 * 86400000).toISOString();
    const d30Start = new Date(now.getTime() - 30 * 86400000).toISOString();

    const row = db.prepare(`
      SELECT 
        COUNT(*) as allTime,
        SUM(CASE WHEN timestamp >= ? THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN timestamp >= ? THEN 1 ELSE 0 END) as last7Days,
        SUM(CASE WHEN timestamp >= ? THEN 1 ELSE 0 END) as last30Days,
        SUM(CASE WHEN source = 'qr' THEN 1 ELSE 0 END) as qr,
        SUM(CASE WHEN source = 'nfc' THEN 1 ELSE 0 END) as nfc
      FROM interactions
      WHERE card_id = ? AND is_bot = 0
    `).get(todayStart, d7Start, d30Start, cardId) as any;

    return {
      today: Number(row?.today || 0),
      last7Days: Number(row?.last7Days || 0),
      last30Days: Number(row?.last30Days || 0),
      allTime: Number(row?.allTime || 0),
      qr: Number(row?.qr || 0),
      nfc: Number(row?.nfc || 0),
    };
  },

  getAnalyticsOverview(orgId: string): AnalyticsOverview {
    const db = getDb();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(now.getTime() - 86400000 * 2).toISOString();
    const d7Start = new Date(now.getTime() - 7 * 86400000).toISOString();
    const d30Start = new Date(now.getTime() - 30 * 86400000).toISOString();

    const row = db.prepare(`
      SELECT 
        COUNT(*) as allTime,
        SUM(CASE WHEN i.timestamp >= ? THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN i.timestamp >= ? AND i.timestamp < ? THEN 1 ELSE 0 END) as yesterday,
        SUM(CASE WHEN i.timestamp >= ? THEN 1 ELSE 0 END) as last7Days,
        SUM(CASE WHEN i.timestamp >= ? THEN 1 ELSE 0 END) as last30Days,
        SUM(CASE WHEN i.source = 'qr' THEN 1 ELSE 0 END) as qrTotal,
        SUM(CASE WHEN i.source = 'nfc' THEN 1 ELSE 0 END) as nfcTotal
      FROM interactions i
      JOIN cards c ON i.card_id = c.id
      JOIN locations l ON c.location_id = l.id
      JOIN businesses b ON l.business_id = b.id
      WHERE b.organization_id = ? AND i.is_bot = 0
    `).get(todayStart, yesterdayStart, todayStart, d7Start, d30Start, orgId) as any;

    const today = Number(row?.today || 0);
    const yesterday = Number(row?.yesterday || 1);
    const last7Days = Number(row?.last7Days || 0);
    const last30Days = Number(row?.last30Days || 0);
    const allTime = Number(row?.allTime || 0);
    const qrTotal = Number(row?.qrTotal || 0);
    const nfcTotal = Number(row?.nfcTotal || 0);

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

  getDailyTrend(orgId: string, days: number = 30): DailyTrendPoint[] {
    const db = getDb();
    const points: DailyTrendPoint[] = [];
    const now = new Date();

    const dateMap = new Map<string, { total: number; qr: number; nfc: number }>();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      dateMap.set(dateStr, { total: 0, qr: 0, nfc: 0 });
    }

    const startDate = new Date(now.getTime() - days * 86400000).toISOString();

    const rows = db.prepare(`
      SELECT 
        SUBSTR(i.timestamp, 1, 10) as date_str,
        COUNT(*) as total,
        SUM(CASE WHEN i.source = 'qr' THEN 1 ELSE 0 END) as qr_count,
        SUM(CASE WHEN i.source = 'nfc' THEN 1 ELSE 0 END) as nfc_count
      FROM interactions i
      JOIN cards c ON i.card_id = c.id
      JOIN locations l ON c.location_id = l.id
      JOIN businesses b ON l.business_id = b.id
      WHERE b.organization_id = ? AND i.timestamp >= ? AND i.is_bot = 0
      GROUP BY SUBSTR(i.timestamp, 1, 10)
    `).all(orgId, startDate) as any[];

    for (const r of rows) {
      if (dateMap.has(r.date_str)) {
        dateMap.set(r.date_str, {
          total: Number(r.total || 0),
          qr: Number(r.qr_count || 0),
          nfc: Number(r.nfc_count || 0),
        });
      }
    }

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

  getTopCards(orgId: string, limit: number = 5): CardWithStats[] {
    const cards = this.getCards({ orgId });
    return cards.sort((a, b) => b.stats.last30Days - a.stats.last30Days).slice(0, limit);
  },

  getPlacementsBreakdown(orgId: string) {
    const db = getDb();
    const rows = db.prepare(`
      SELECT 
        c.placement,
        COUNT(i.id) as interactions,
        COUNT(DISTINCT c.id) as card_count
      FROM cards c
      JOIN locations l ON c.location_id = l.id
      JOIN businesses b ON l.business_id = b.id
      LEFT JOIN interactions i ON i.card_id = c.id AND i.is_bot = 0
      WHERE b.organization_id = ?
      GROUP BY c.placement
      ORDER BY interactions DESC
    `).all(orgId) as any[];

    return rows.map((r) => ({
      placement: r.placement as CardPlacement,
      interactions: Number(r.interactions || 0),
      card_count: Number(r.card_count || 0),
    }));
  },

  // Admin inventory
  getAllInventoryCards() {
    const db = getDb();
    return db.prepare(`
      SELECT 
        c.*,
        l.name as location_name,
        b.name as business_name,
        COUNT(i.id) as total_interactions
      FROM cards c
      LEFT JOIN locations l ON c.location_id = l.id
      LEFT JOIN businesses b ON l.business_id = b.id
      LEFT JOIN interactions i ON i.card_id = c.id AND i.is_bot = 0
      GROUP BY c.id
      ORDER BY c.inventory_code ASC
    `).all() as any[];
  },

  batchGenerateBlankCards(count: number = 10): Card[] {
    const db = getDb();
    const lastRow = db.prepare(`
      SELECT inventory_code FROM cards 
      WHERE inventory_code LIKE 'RT-%' 
      ORDER BY inventory_code DESC LIMIT 1
    `).get() as { inventory_code: string } | undefined;

    let startNum = 100100;
    if (lastRow?.inventory_code) {
      const match = lastRow.inventory_code.replace('RT-', '');
      const parsed = parseInt(match, 10);
      if (!isNaN(parsed)) startNum = parsed + 1;
    }

    const created: Card[] = [];
    for (let i = 0; i < count; i++) {
      const code = 'RT-' + (startNum + i);
      const card = this.createCard({
        location_id: null,
        name: 'Blank ' + code,
        placement: 'cashier',
        inventory_code: code,
      });
      created.push(card);
    }
    return created;
  },

  getSystemOverview() {
    const db = getDb();
    const orgs = db.prepare('SELECT COUNT(*) as c FROM organizations').get() as { c: number };
    const biz = db.prepare('SELECT COUNT(*) as c FROM businesses WHERE archived_at IS NULL').get() as { c: number };
    const locs = db.prepare('SELECT COUNT(*) as c FROM locations').get() as { c: number };
    const cards = db.prepare('SELECT COUNT(*) as c FROM cards').get() as { c: number };
    const activeCards = db.prepare("SELECT COUNT(*) as c FROM cards WHERE status = 'active' AND location_id IS NOT NULL").get() as { c: number };
    const interactions = db.prepare('SELECT COUNT(*) as c FROM interactions WHERE is_bot = 0').get() as { c: number };
    const todayInteractions = db.prepare(`
      SELECT COUNT(*) as c FROM interactions 
      WHERE is_bot = 0 AND timestamp >= date('now', 'start of day')
    `).get() as { c: number };

    return {
      totalOrganizations: orgs.c,
      totalBusinesses: biz.c,
      totalLocations: locs.c,
      totalCards: cards.c,
      activeCards: activeCards.c,
      totalInteractions: interactions.c,
      todayInteractions: todayInteractions.c,
    };
  }
};
