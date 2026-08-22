import { PlaceSearchResult, PlaceDetail } from './types';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

/**
 * Searches Google Places API (New Text Search) for businesses matching query and optional city.
 */
export async function searchPlaces(query: string, city?: string): Promise<PlaceSearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const textQuery = city ? `${cleanQuery} ${city.trim()}` : cleanQuery;

  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('[Places API] GOOGLE_PLACES_API_KEY is not set. Returning mock results for local development.');
    return [
      {
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        name: cleanQuery,
        address: city ? `Jl. Sudirman No. 1, ${city}` : 'Jl. Sudirman No. 1, Jakarta',
        google_maps_url: 'https://maps.google.com/?cid=1024',
      },
      {
        place_id: 'ChIJgUb9-5WaEmsRik5ik2CQoq3',
        name: `${cleanQuery} Branch 2`,
        address: city ? `Jl. Thamrin No. 88, ${city}` : 'Jl. Thamrin No. 88, Jakarta',
        google_maps_url: 'https://maps.google.com/?cid=2048',
      },
    ];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery,
        languageCode: 'id',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`[Places API] Error ${response.status}: ${errText}`);
      return [];
    }

    const data = await response.json();
    const places = data.places || [];

    return places.map((p: any) => ({
      place_id: p.id,
      name: p.displayName?.text || cleanQuery,
      address: p.formattedAddress || '',
      google_maps_url: p.googleMapsUri || null,
    }));
  } catch (err: any) {
    console.error('[Places API] Search failed:', err.message || err);
    return [];
  }
}

/**
 * Fetches place details by Google Place ID.
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetail | null> {
  if (!placeId) return null;

  if (!GOOGLE_PLACES_API_KEY) {
    return {
      place_id: placeId,
      name: 'Business Location',
      address: 'Jl. Sudirman No. 1, Jakarta',
      google_maps_uri: `https://maps.google.com/?cid=${placeId}`,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,googleMapsUri',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const p = await response.json();
    return {
      place_id: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      google_maps_uri: p.googleMapsUri || null,
    };
  } catch (err: any) {
    console.error('[Places API] GetPlaceDetails failed:', err.message || err);
    return null;
  }
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
