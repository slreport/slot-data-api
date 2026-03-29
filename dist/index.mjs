// src/index.ts
var BASE_URL = "https://slot.report/api/v1";
async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`slot-data-api: ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json();
}
function matchesFilter(slot, filter) {
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
var slotsCache = null;
var providersCacheMap = /* @__PURE__ */ new Map();
async function getSlots() {
  if (!slotsCache) {
    slotsCache = await fetchJson("/slots.json");
  }
  return slotsCache;
}
async function getSlot(slug) {
  return fetchJson(`/slots/${slug}.json`);
}
async function getProviders() {
  return fetchJson("/providers.json");
}
async function getProviderSlots(providerSlug) {
  if (!providersCacheMap.has(providerSlug)) {
    const data = await fetchJson(`/providers/${providerSlug}.json`);
    providersCacheMap.set(providerSlug, data);
  }
  return providersCacheMap.get(providerSlug);
}
async function getStatus() {
  return fetchJson("/status.json");
}
async function searchSlots(query) {
  const { results } = await getSlots();
  const q = query.toLowerCase();
  return results.filter((s) => s.name.toLowerCase().includes(q));
}
async function filterSlots(filter) {
  const { results } = await getSlots();
  return results.filter((s) => matchesFilter(s, filter));
}
async function topByMaxWin(limit = 10) {
  const { results } = await getSlots();
  return results.filter((s) => s.max_win != null).sort((a, b) => b.max_win - a.max_win).slice(0, limit);
}
async function topByRtp(limit = 10) {
  const { results } = await getSlots();
  return results.filter((s) => s.rtp != null).sort((a, b) => b.rtp - a.rtp).slice(0, limit);
}
function clearCache() {
  slotsCache = null;
  providersCacheMap.clear();
}
export {
  clearCache,
  filterSlots,
  getProviderSlots,
  getProviders,
  getSlot,
  getSlots,
  getStatus,
  searchSlots,
  topByMaxWin,
  topByRtp
};
