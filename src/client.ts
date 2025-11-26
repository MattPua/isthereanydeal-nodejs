import { DealsListService } from './services/deals-list.service'
import { GamesService } from './services/games.service'
import { LookupService } from './services/lookup.service'
import { ShopsService } from './services/shops.service'
import { StatsService } from './services/stats.service'

export class IThereAnyDealClient {
	protected _apiKey: string
	public readonly gamesService: GamesService
	public readonly lookupService: LookupService
	public readonly dealsListService: DealsListService
	public readonly statsService: StatsService
	public readonly shopsService: ShopsService
	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error('API key is required')
		}
		this.gamesService = new GamesService(apiKey)
		this.lookupService = new LookupService(apiKey)
		this.dealsListService = new DealsListService(apiKey)
		this.statsService = new StatsService(apiKey)
		this.shopsService = new ShopsService(apiKey)
		this._apiKey = apiKey
	}
}
