import type { IsThereAnyDealClientOptions } from './client.types'
import { BundlesService } from './services/bundles.service'
import { DealsListService } from './services/deals-list.service'
import { GamesService } from './services/games.service'
import { GiveawaysService } from './services/giveaways.service'
import { LookupService } from './services/lookup.service'
import { ShopsService } from './services/shops.service'
import { StatsService } from './services/stats.service'

export type {
	ApiKeyTransport,
	IsThereAnyDealClientOptions,
} from './client.types'

export class IsThereAnyDealClient {
	protected _apiKey: string
	public readonly gamesService: GamesService
	public readonly lookupService: LookupService
	public readonly dealsListService: DealsListService
	public readonly statsService: StatsService
	public readonly shopsService: ShopsService
	public readonly bundlesService: BundlesService
	public readonly giveawaysService: GiveawaysService
	constructor(apiKey: string, options: IsThereAnyDealClientOptions = {}) {
		if (!apiKey) {
			throw new Error('API key is required')
		}
		const apiKeyTransport = options.apiKeyTransport ?? 'header'
		this.gamesService = new GamesService(apiKey, apiKeyTransport)
		this.lookupService = new LookupService(apiKey, apiKeyTransport)
		this.dealsListService = new DealsListService(apiKey, apiKeyTransport)
		this.statsService = new StatsService(apiKey, apiKeyTransport)
		this.shopsService = new ShopsService(apiKey, apiKeyTransport)
		this.bundlesService = new BundlesService(apiKey, apiKeyTransport)
		this.giveawaysService = new GiveawaysService(apiKey, apiKeyTransport)
		this._apiKey = apiKey
	}
}
