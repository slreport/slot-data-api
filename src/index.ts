const BASE_URL = "https://slot.report/api/v1";

export interface Slot {
  name: string;
  slug: string;
  provider: string;
  provider_slug: string;
  rtp: number | null;
  volatility: "low" | "medium" | "high" | "very-high" | "extreme" | null;
  volatility_score: number | null;
  max_win: number | null;
  max_win_category: string | null;
  features: string[] | null;
  mechanic: string | null;
  theme: string | null;
  grid: string | null;
  paylines: number | null;
  has_bonus_buy: boolean | null;
  has_jackpot: boolean | null;
  release_date: string | null;
  year: number | null;
  hit_frequency: number | null;
  min_bet: number | null;
  max_bet: number | null;
}

export interface SlotDetail extends Slot {
  rtp_tiers: number[] | null;
  summary: string | null;
  score: number | null;
  bonus_buy_prices: { name: string; price: number }[] | null;
  bonus_trigger_rates: { name: string; spins: number }[] | null;
  series: string | null;
}

export interface Provider {
  name: string;
  slug: string;
  slot_count: number;
  avg_rtp: number;
}

export interface ApiStatus {
  version: string;
  last_updated: string;
  total_slots: number;
  total_providers: number;
}

export interface SlotsResponse {
  count: number;
  results: Slot[];
}

export interface ProviderSlotsResponse {
  provider: string;
  count: number;
  results: Slot[];
}

export interface ProvidersResponse {
  count: number;
  results: Provider[];
}

export type Volatility = "low" | "medium" | "high" | "very-high" | "extreme";

export interface SlotFilter {
  provider?: string;
  volatility?: Volatility;
  minRtp?: number;
  maxRtp?: number;
  minMaxWin?: number;
  maxMaxWin?: number;
  feature?: string;
  mechanic?: string;
  theme?: string;
  hasBonusBuy?: boolean;
  hasJackpot?: boolean;
  year?: number;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`slot-data-api: ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json() as Promise<T>;
}

function matchesFilter(slot: Slot, filter: SlotFilter): boolean {
  if (filter.provider && slot.provider_slug !== filter.provider) return false;
  if (filter.volatility && slot.volatility !== filter.volatility) return false;
  if (filter.minRtp != null && (slot.rtp == null || slot.rtp < filter.minRtp)) return false;
  if (filter.maxRtp != null && (slot.rtp == null || slot.rtp > filter.maxRtp)) return false;
  if (filter.minMaxWin != null && (slot.max_win == null || slot.max_win < filter.minMaxWin)) return false;
  if (filter.maxMaxWin != null && (slot.max_win == null || slot.max_win > filter.maxMaxWin)) return false;
  if (filter.feature && (!slot.features || !slot.features.includes(filter.feature))) return false;
  if (filter.mechanic && slot.mechanic !== filter.mechanic) return false;
  if (filter.theme && slot.theme !== filter.theme) return false;
  if (filter.hasBonusBuy != null && slot.has_bonus_buy !== filter.hasBonusBuy) return false;
  if (filter.hasJackpot != null && slot.has_jackpot !== filter.hasJackpot) return false;
  if (filter.year != null && slot.year !== filter.year) return false;
  return true;
}

let slotsCache: SlotsResponse | null = null;
let providersCacheMap: Map<string, ProviderSlotsResponse> = new Map();

/**
 * Get all slots. Results are cached after the first call.
 */
export async function getSlots(): Promise<SlotsResponse> {
  if (!slotsCache) {
    slotsCache = await fetchJson<SlotsResponse>("/slots.json");
  }
  return slotsCache;
}

/**
 * Get full details for a single slot by slug.
 */
export async function getSlot(slug: string): Promise<SlotDetail> {
  return fetchJson<SlotDetail>(`/slots/${slug}.json`);
}

/**
 * Get all providers with slot count and average RTP.
 */
export async function getProviders(): Promise<ProvidersResponse> {
  return fetchJson<ProvidersResponse>("/providers.json");
}

/**
 * Get all slots from a specific provider.
 */
export async function getProviderSlots(providerSlug: string): Promise<ProviderSlotsResponse> {
  if (!providersCacheMap.has(providerSlug)) {
    const data = await fetchJson<ProviderSlotsResponse>(`/providers/${providerSlug}.json`);
    providersCacheMap.set(providerSlug, data);
  }
  return providersCacheMap.get(providerSlug)!;
}

/**
 * Get API status and metadata.
 */
export async function getStatus(): Promise<ApiStatus> {
  return fetchJson<ApiStatus>("/status.json");
}

/**
 * Search slots by name (case-insensitive substring match).
 */
export async function searchSlots(query: string): Promise<Slot[]> {
  const { results } = await getSlots();
  const q = query.toLowerCase();
  return results.filter((s) => s.name.toLowerCase().includes(q));
}

/**
 * Filter slots by multiple criteria.
 */
export async function filterSlots(filter: SlotFilter): Promise<Slot[]> {
  const { results } = await getSlots();
  return results.filter((s) => matchesFilter(s, filter));
}

/**
 * Get top slots by max win multiplier.
 */
export async function topByMaxWin(limit = 10): Promise<Slot[]> {
  const { results } = await getSlots();
  return results
    .filter((s) => s.max_win != null)
    .sort((a, b) => b.max_win! - a.max_win!)
    .slice(0, limit);
}

/**
 * Get top slots by RTP.
 */
export async function topByRtp(limit = 10): Promise<Slot[]> {
  const { results } = await getSlots();
  return results
    .filter((s) => s.rtp != null)
    .sort((a, b) => b.rtp! - a.rtp!)
    .slice(0, limit);
}

/**
 * Clear the internal cache. Useful for long-running processes.
 */
export function clearCache(): void {
  slotsCache = null;
  providersCacheMap.clear();
}
