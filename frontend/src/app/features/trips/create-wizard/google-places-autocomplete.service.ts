import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface PlaceSuggestion {
  placeId: string;
  text: string;
  secondaryText?: string;
}

interface PlacesAutocompleteResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
    };
  }>;
}

interface PlaceDetailsResponse {
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
}

interface PlaceAddressMeta {
  postal?: string;
  city?: string;
  region?: string;
}

@Injectable({ providedIn: 'root' })
export class GooglePlacesAutocompleteService {
  private readonly endpoint = 'https://places.googleapis.com/v1/places:autocomplete';
  private readonly detailsEndpoint = 'https://places.googleapis.com/v1/places';
  private detailsCache = new Map<string, PlaceAddressMeta>();

  constructor(private http: HttpClient) {}

  isEnabled(): boolean {
    return !!environment.googlePlaces.enabled && !!environment.googlePlaces.apiKey;
  }

  search(input: string): Observable<PlaceSuggestion[]> {
    const query = String(input || '').trim();
    const cfg = environment.googlePlaces;

    if (!this.isEnabled() || query.length < cfg.minQueryLength) {
      return of([]);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': cfg.apiKey,
      'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
    });

    const body: Record<string, any> = {
      input: query,
      languageCode: 'en',
    };

    if (cfg.regionCodes?.length) {
      body['includedRegionCodes'] = cfg.regionCodes;
    }

    return this.http.post<PlacesAutocompleteResponse>(this.endpoint, body, { headers }).pipe(
      map((res) => {
        const rows = (res?.suggestions || [])
          .map((s) => s?.placePrediction)
          .filter((p): p is NonNullable<typeof p> => !!p)
          .map((p) => ({
            placeId: String(p.placeId || ''),
            text: String(p.text?.text || '').trim(),
          }))
          .filter((p) => !!p.placeId && !!p.text);

        return rows.slice(0, cfg.maxSuggestions || 4);
      }),
      switchMap((rows) => {
        if (!rows.length) return of(rows);
        return forkJoin(rows.map((row) => this.enrichSuggestion(row)));
      }),
      catchError(() => of([]))
    );
  }

  private enrichSuggestion(base: PlaceSuggestion): Observable<PlaceSuggestion> {
    const cached = this.detailsCache.get(base.placeId);
    if (cached) {
      return of({ ...base, secondaryText: this.composeSecondary(cached) });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': environment.googlePlaces.apiKey,
      'X-Goog-FieldMask': 'addressComponents',
    });

    return this.http
      .get<PlaceDetailsResponse>(`${this.detailsEndpoint}/${encodeURIComponent(base.placeId)}`, { headers })
      .pipe(
        map((details) => this.extractAddressMeta(details)),
        map((meta) => {
          this.detailsCache.set(base.placeId, meta);
          return { ...base, secondaryText: this.composeSecondary(meta) };
        }),
        catchError(() => of(base))
      );
  }

  private extractAddressMeta(details: PlaceDetailsResponse): PlaceAddressMeta {
    const comps = details?.addressComponents || [];
    const byType = (type: string): string => {
      const comp = comps.find((c) => (c.types || []).includes(type));
      return String(comp?.longText || comp?.shortText || '').trim();
    };

    const city =
      byType('locality') ||
      byType('postal_town') ||
      byType('administrative_area_level_3') ||
      byType('sublocality_level_1');

    const region =
      byType('administrative_area_level_1') ||
      byType('administrative_area_level_2') ||
      byType('administrative_area_level_3');

    const postal = byType('postal_code');

    return { postal, city, region };
  }

  private composeSecondary(meta: PlaceAddressMeta): string {
    return [meta.postal, meta.city, meta.region].filter((v) => !!v).join(', ');
  }
}
