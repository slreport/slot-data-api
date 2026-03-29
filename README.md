# slot-data-api

JavaScript/TypeScript client for the [slot.report Slot Data API](https://slot.report/api/). Access data for 5,600+ online slot games — RTP, volatility, max win, features, mechanics, themes and more.

No API key required. No authentication. No signup.

## Install

```bash
npm install slot-data-api
```

## Quick Start

```js
import { getSlots, getSlot, searchSlots, filterSlots } from 'slot-data-api';

// Get all 5,600+ slots
const { count, results } = await getSlots();
console.log(`${count} slots loaded`);

// Get details for a single slot
const goo = await getSlot('gates-of-olympus');
console.log(goo.name, goo.rtp, goo.volatility, goo.max_win);

// Search by name
const results = await searchSlots('bonanza');
```

## Filtering

```js
import { filterSlots } from 'slot-data-api';

// Extreme volatility slots with 10,000x+ max win
const extreme = await filterSlots({
  volatility: 'extreme',
  minMaxWin: 10000,
});

// Hacksaw Gaming slots with bonus buy
const hacksaw = await filterSlots({
  provider: 'hacksaw-gaming',
  hasBonusBuy: true,
});

// High RTP mythology-themed slots
const myths = await filterSlots({
  minRtp: 96.5,
  theme: 'mythology',
});
```

## API

### Data Functions

| Function | Description |
|---|---|
| `getSlots()` | All slots (cached after first call) |
| `getSlot(slug)` | Full detail for one slot |
| `getProviders()` | All 58 providers with slot count and avg RTP |
| `getProviderSlots(slug)` | All slots from one provider |
| `getStatus()` | API version, last update, total counts |

### Query Functions

| Function | Description |
|---|---|
| `searchSlots(query)` | Search slots by name |
| `filterSlots(filter)` | Filter by provider, volatility, RTP, max win, features, mechanic, theme, bonus buy, jackpot, year |
| `topByMaxWin(limit?)` | Top slots by max win multiplier |
| `topByRtp(limit?)` | Top slots by RTP |
| `clearCache()` | Clear internal cache |

### Filter Options

```ts
interface SlotFilter {
  provider?: string;        // provider slug, e.g. 'hacksaw-gaming'
  volatility?: 'low' | 'medium' | 'high' | 'very-high' | 'extreme';
  minRtp?: number;
  maxRtp?: number;
  minMaxWin?: number;
  maxMaxWin?: number;
  feature?: string;         // e.g. 'free-spins', 'multiplier', 'wilds'
  mechanic?: string;        // e.g. 'cluster-pays', 'megaways'
  theme?: string;           // e.g. 'mythology', 'fruit', 'adventure'
  hasBonusBuy?: boolean;
  hasJackpot?: boolean;
  year?: number;
}
```

## Data Coverage

| Field | Coverage |
|---|---|
| rtp | 99% |
| volatility | 97% |
| features | 96% |
| theme | 95% |
| max_win | 94% |
| mechanic | 86% |
| release_date | 84% |
| grid | 79% |

## Requirements

- Node.js 18+ (uses native `fetch`)
- Works in browsers, Deno, Bun, Cloudflare Workers

## License

MIT — Data provided by [slot.report](https://slot.report/)
