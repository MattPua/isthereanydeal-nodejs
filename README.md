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

const results = client.games.searchForGame({
	title: 'The Witcher 3',
	results: 5,
});

console.log(results);
```

## Features

Currently all methods that do not require OAuth authentication are available. Please see the [documentation](https://docs.isthereanydeal.com/) for more information.

## Developing Locally

This project requires the following dependencies to be installed:
- [Bun](https://bun.sh)
- [Node.js](https://nodejs.org)

To install the dependencies, run the following command:

```bash
bun install
```

## Testing

Please create a `.env.test.local` file with the following content:

```env
IS_THERE_ANY_DEAL_API_KEY=your-api-key
```

After which, you can run the tests with the following command:

```bash
bun test
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT

## Disclaimer

This project is not affiliated with IsThereAnyDeal. All trademarks are property of their respective owners in the US and other countries. 