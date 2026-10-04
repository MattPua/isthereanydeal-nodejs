# IsThereAnyDeal Node.js Library (Unofficial)

[![npm version](https://img.shields.io/npm/v/isthereanydeal-nodejs.svg?style=flat-square)](https://www.npmjs.com/package/isthereanydeal-nodejs)
[![npm downloads](https://img.shields.io/npm/dm/isthereanydeal-nodejs.svg?style=flat-square)](https://www.npmjs.com/package/isthereanydeal-nodejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/mattpua/isthereanydeal-nodejs/issues)

An unofficial Node.js library for the IsThereAnyDeal API written in TypeScript. This library is built with [Bun](https://bun.sh) and [Zod](https://zod.dev).

Based on documentation from [IsThereAnyDeal](https://docs.isthereanydeal.com/).

This SDK provides a simple way to interact with different parts of the IsThereAnyDeal API. 

This library is not affiliated with IsThereAnyDeal. All trademarks are property of their respective owners in the US and other countries. 

## Installation

```bash
bun add isthereanydeal-nodejs
```

## Documentation

For full information on the API, please see the [documentation](https://docs.isthereanydeal.com/).

## Setup

An API key is required to use the library. You can get one by [signing up for a free account](https://isthereanydeal.com/apps/).

```typescript
import { IsThereAnyDealClient } from 'isthereanydeal-nodejs';

const client = new IsThereAnyDealClient('your-api-key');

const results = client.gamesService.searchForGame({
	title: 'The Witcher 3',
	results: 5,
});

console.log(results);
```

By default, the client sends the API key in the `ITAD-API-Key` request header.
For environments that require query-string authentication, opt in explicitly:

```typescript
const client = new IsThereAnyDealClient('your-api-key', {
	apiKeyTransport: 'query',
});
```

## Features

The client covers the stable API-key endpoints for games, lookup, deals, shops,
bundles, giveaways, and statistics. OAuth-only, unstable, and internal
endpoints are not included. See the [IsThereAnyDeal API documentation](https://docs.isthereanydeal.com/)
for endpoint details.

The client exposes `bundlesService.getBundles(options?)`,
`giveawaysService.getGiveaways(options?)`, and
`giveawaysService.getGiveawaysForGame(gameId, options?)` for bundle and giveaway
lists. `shopsService.getShopMap()` returns the full shop map, while
`lookupService.lookupShopIdsByGameIds(shopId, gameIds)` maps ITAD game IDs to
shop product IDs. Deals can be requested with `dealsListService.getDeals(options)`
or its POST equivalent `dealsListService.getDealsByPost(options)`.

For example, filter deals to games with at least 50% off and any selected tag:

```typescript
const deals = await client.dealsListService.getDeals({
	filter: {
		cut: { min: 50, max: null },
		tagsUnion: ['RPG'],
	},
})
```

## Developing Locally

This project requires the following dependencies to be installed:
- [Bun](https://bun.sh)
- [Node.js](https://nodejs.org)

To install the dependencies, run the following command:

```bash
bun install
```

## Testing

The test suite stubs `fetch` and does not require an API key or make production
API requests. Run it with:

```bash
bun run test
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT

## Disclaimer

This project is not affiliated with IsThereAnyDeal. All trademarks are property of their respective owners in the US and other countries.
