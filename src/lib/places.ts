import { PlaceSearchResult, PlaceDetail } from './types';
import * as Sentry from '@sentry/nextjs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const PLACES_BASE_URL = 'https://places.googleapis.com/v1';

/**
 * Thrown when the upstream Google Places API is unreachable or misconfigured.
 * Distinct from "zero results", which is a normal empty response.
 */
export class PlacesUnavailableError extends Error {}

async function placesFetch(path: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${PLACES_BASE_URL}${path}`, {
      ...init,
      headers: { ...init.headers, 'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY },
      signal: controller.signal,
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`[Places API] ${path} error ${response.status}: ${errText.slice(0, 300)}`);
      Sentry.captureMessage(`[Places API] ${path} failed with ${response.status}`, {
        level: 'error',
        extra: { status: response.status, body: errText.slice(0, 500) },
      });
      throw new PlacesUnavailableError(`Google Places API responded ${response.status}`);
    }
    return response;
  } catch (err: any) {
    if (err instanceof PlacesUnavailableError) throw err;
    if (err?.name === 'AbortError') {
      throw new PlacesUnavailableError('Google Places API request timed out');
    }
    console.error('[Places API] Request failed:', err?.message || err);
    throw new PlacesUnavailableError('Could not reach Google Places API');
  } finally {
    clearTimeout(timeout);
  }
}

function mapSearchPlace(p: any, fallbackName: string): PlaceSearchResult {
  return {
    place_id: p.id,
    name: p.displayName?.text || fallbackName,
    address: p.formattedAddress || '',
    google_maps_url: p.googleMapsUri || null,
  };
}

const DEV_MOCK_RESULTS: PlaceSearchResult[] = [
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Mock Cafe',
    address: 'Jl. Sudirman No. 1, Jakarta',
    google_maps_url: 'https://maps.google.com/?cid=1024',
  },
];

function devMockResults(query: string, city?: string): PlaceSearchResult[] {
  console.warn('[Places API] GOOGLE_PLACES_API_KEY not set — returning mock results (development only).');
  const base = DEV_MOCK_RESULTS[0];
  return [
    { ...base, name: query, address: city ? `Jl. Sudirman No. 1, ${city}` : base.address },
    { place_id: 'mock-place-2', name: `${query} Cabang 2`, address: city ? `Jl. Thamrin No. 88, ${city}` : 'Jl. Thamrin No. 88, Jakarta', google_maps_url: null },
  ];
}

/**
 * Searches Google Places API (New Text Search) for businesses matching query and optional city.
 * Returns [] when nothing matches; throws PlacesUnavailableError on API/transport failure.
 */
export async function searchPlaces(query: string, city?: string): Promise<PlaceSearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const textQuery = city ? `${cleanQuery} ${city.trim()}` : cleanQuery;

  if (!GOOGLE_PLACES_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new PlacesUnavailableError('GOOGLE_PLACES_API_KEY is not configured');
    }
    return devMockResults(cleanQuery, city);
  }

  try {
    const response = await placesFetch(
      '/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri',
        },
        body: JSON.stringify({ textQuery, languageCode: 'id' }),
      },
      6000
    );

    const data = await response.json();
    const places: any[] = data.places || [];
    return places.map((p) => mapSearchPlace(p, cleanQuery));
  } catch (err) {
    if (err instanceof PlacesUnavailableError) throw err;
    console.error('[Places API] Search failed:', (err as Error)?.message || err);
    throw new PlacesUnavailableError('Google Places search failed');
  }
}

/**
 * Fetches place details by Google Place ID.
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetail | null> {
  if (!placeId) return null;

  if (!GOOGLE_PLACES_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new PlacesUnavailableError('GOOGLE_PLACES_API_KEY is not configured');
    }
    console.warn('[Places API] GOOGLE_PLACES_API_KEY not set — returning mock details (development only).');
    return {
      place_id: placeId,
      name: 'Business Location',
      address: 'Jl. Sudirman No. 1, Jakarta',
      google_maps_uri: `https://maps.google.com/?cid=${placeId}`,
    };
  }

  const response = await placesFetch(
    `/places/${encodeURIComponent(placeId)}`,
    {
      headers: { 'X-Goog-FieldMask': 'id,displayName,formattedAddress,googleMapsUri' },
    },
    5000
  );

  const p = await response.json();
  return {
    place_id: p.id,
    name: p.displayName?.text || '',
    address: p.formattedAddress || '',
    google_maps_uri: p.googleMapsUri || null,
  };
}

/**
 * Builds the direct Google Review URL from a Google Place ID or direct Google URL.
 */
export function buildReviewUrl(placeId: string): string {
  const trimmed = (placeId || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(trimmed)}`;
}
