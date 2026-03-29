const { getSlots, getSlot, getProviders, getStatus, searchSlots, filterSlots, topByMaxWin, topByRtp } = require('./dist/index.js');

async function run() {
  console.log('--- Status ---');
  const status = await getStatus();
  console.log(status);

  console.log('\n--- All Slots ---');
  const { count } = await getSlots();
  console.log(`${count} slots loaded`);

  console.log('\n--- Search: bonanza ---');
  const bonanza = await searchSlots('bonanza');
  console.log(`${bonanza.length} results:`, bonanza.slice(0, 3).map(s => s.name));

  console.log('\n--- Filter: extreme + 10000x+ ---');
  const extreme = await filterSlots({ volatility: 'extreme', minMaxWin: 10000 });
  console.log(`${extreme.length} slots:`, extreme.slice(0, 5).map(s => `${s.name} (${s.max_win}x)`));

  console.log('\n--- Top 5 by Max Win ---');
  const top = await topByMaxWin(5);
  top.forEach(s => console.log(`  ${s.name}: ${s.max_win}x (${s.provider})`));

  console.log('\n--- Top 5 by RTP ---');
  const topRtp = await topByRtp(5);
  topRtp.forEach(s => console.log(`  ${s.name}: ${s.rtp}% (${s.provider})`));

  console.log('\n--- Providers ---');
  const providers = await getProviders();
  console.log(`${providers.count} providers`);

  console.log('\n--- Single Slot: gates-of-olympus ---');
  const goo = await getSlot('gates-of-olympus');
  console.log(`${goo.name} | RTP: ${goo.rtp}% | Vol: ${goo.volatility} | Max Win: ${goo.max_win}x`);

  console.log('\nAll tests passed!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
