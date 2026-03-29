interface Slot {
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
interface SlotDetail extends Slot {
    rtp_tiers: number[] | null;
    summary: string | null;
    score: number | null;
    bonus_buy_prices: {
        name: string;
        price: number;
    }[] | null;
    bonus_trigger_rates: {
        name: string;
        spins: number;
    }[] | null;
    series: string | null;
}
interface Provider {
    name: string;
    slug: string;
    slot_count: number;
    avg_rtp: number;
}
interface ApiStatus {
    version: string;
    last_updated: string;
    total_slots: number;
    total_providers: number;
}
interface SlotsResponse {
    count: number;
    results: Slot[];
}
interface ProviderSlotsResponse {
    provider: string;
    count: number;
    results: Slot[];
}
interface ProvidersResponse {
    count: number;
    results: Provider[];
}
type Volatility = "low" | "medium" | "high" | "very-high" | "extreme";
interface SlotFilter {
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
/**
 * Get all slots. Results are cached after the first call.
 */
declare function getSlots(): Promise<SlotsResponse>;
/**
 * Get full details for a single slot by slug.
 */
declare function getSlot(slug: string): Promise<SlotDetail>;
/**
 * Get all providers with slot count and average RTP.
 */
declare function getProviders(): Promise<ProvidersResponse>;
/**
 * Get all slots from a specific provider.
 */
declare function getProviderSlots(providerSlug: string): Promise<ProviderSlotsResponse>;
/**
 * Get API status and metadata.
 */
declare function getStatus(): Promise<ApiStatus>;
/**
 * Search slots by name (case-insensitive substring match).
 */
declare function searchSlots(query: string): Promise<Slot[]>;
/**
 * Filter slots by multiple criteria.
 */
declare function filterSlots(filter: SlotFilter): Promise<Slot[]>;
/**
 * Get top slots by max win multiplier.
 */
declare function topByMaxWin(limit?: number): Promise<Slot[]>;
/**
 * Get top slots by RTP.
 */
declare function topByRtp(limit?: number): Promise<Slot[]>;
/**
 * Clear the internal cache. Useful for long-running processes.
 */
declare function clearCache(): void;

export { type ApiStatus, type Provider, type ProviderSlotsResponse, type ProvidersResponse, type Slot, type SlotDetail, type SlotFilter, type SlotsResponse, type Volatility, clearCache, filterSlots, getProviderSlots, getProviders, getSlot, getSlots, getStatus, searchSlots, topByMaxWin, topByRtp };
