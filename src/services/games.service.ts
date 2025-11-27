import type {
	Bundle,
	Game,
	HistoricLowPrice,
	HistoricStoreLowPrice,
} from '../schemas/responses/common.schema'
import type {
	GameInfoResponse,
	GameSubscriptionsResponse,
	HistoryLog,
	LookupGameResponse,
	PriceOverview,
	PricesResponse,
} from '../schemas/responses/games.schema'
import { BaseService } from './_base.service'

export class GamesService extends BaseService {
	constructor(apiKey: string) {
		super(apiKey, 'games')
	}

	/**
	 * Searches for a games by title
	 * @param title - The title of the game to search for
	 * @param results - The number of results to return. Defaults to 20, max is 100
	 * @returns An array of games
	 */
	async searchForGame({
		title,
		results = 20,
	}: {
		title: string
		results?: number
	}): Promise<Game[]> {
		const url = this.generateUrl('/search/v1', {
			title,
			results,
		})
		return await this.sendGETRequest<Game[]>(url)
	}

	/**
	 *
	 * @param appid - The steam appid of the game to lookup
	 * @param title - The title of the game to lookup
	 * @returns
	 */
	async lookupGame(
		query: { appid: string | number } | { title: string },
	): Promise<LookupGameResponse> {
		const url = this.generateUrl('/lookup/v1', {
			...query,
		})
		return await this.sendGETRequest<LookupGameResponse>(url)
	}

	/**
	 * Gets the info for a game
	 * @param id - The ID of the game on IThereAnyDeal (not to be confused with the Steam appid)
	 * @returns The info for the game
	 */ async getGameInfo(id: string): Promise<GameInfoResponse> {
		const url = this.generateUrl('/info/v2', {
			id,
		})
		return await this.sendGETRequest<GameInfoResponse>(url)
	}

	/**
	 *
	 * @param gameIds
	 * @param options.country - Two letter country ISO code, defaults to US
	 * @param options.deals - only load deals, omit prices that have no price cut
	 * @param options.vouchers - allows vouchers in prices
	 * @param options.capacity - how many prices to load per game, 0 or undefined for no limit
	 * @param options.shops - only load prices from these shops, defaults to all shops
	 * @returns a list of prices
	 */
	async getPrices(
		gameIds: string[],
		options: {
			country?: string
			deals?: boolean
			vouchers?: boolean
			capacity?: number
			shops?: number[]
		} = {
			country: 'US',
			deals: false,
			vouchers: true,
			capacity: undefined,
			shops: undefined,
		},
	): Promise<PricesResponse[]> {
		const url = this.generateUrl('/prices/v3', options)
		const response = await this.sendPOSTRequest<PricesResponse[], string[]>(
			url,
			gameIds,
		)
		return response
	}

	/**
	 * Gets basic price overview for selected games
	 * Each game's current best price will be loaded, historical low
	 * Also will return active bundles if contains any games in the overview
	 * @param gameIds
	 * @param options
	 * @returns
	 */
	async getPriceOverview(
		gameIds: string[],
		options: {
			country?: string
			shops?: number[]
			vouchers?: boolean
		} = {
			country: 'US',
			shops: undefined,
			vouchers: true,
		},
	): Promise<PriceOverview> {
		const url = this.generateUrl('/overview/v2', options)
		const response = await this.sendPOSTRequest<PriceOverview, string[]>(
			url,
			gameIds,
		)
		return response
	}

	/**
	 * Gets the history low price for a game
	 * @param gameIds at least 1 game ID is required
	 * @param options.country - Two letter country ISO code, defaults to US
	 * @returns a list of history low prices
	 */
	async getHistoryLow(
		gameIds: string[],
		options: {
			country?: string
		} = {
			country: 'US',
		},
	): Promise<HistoricLowPrice[]> {
		const url = this.generateUrl('/historylow/v1', options)
		const response = await this.sendPOSTRequest<HistoricLowPrice[], string[]>(
			url,
			gameIds,
		)
		return response
	}

	async getStoreLow(
		gameIds: string[],
		options: {
			country?: string
			shops?: number[]
		} = {
			country: 'US',
			shops: undefined,
		},
	): Promise<HistoricStoreLowPrice[]> {
		const url = this.generateUrl('/storelow/v2', options)
		const response = await this.sendPOSTRequest<
			HistoricStoreLowPrice[],
			string[]
		>(url, gameIds)
		return response
	}

	/**
	 *
	 * @param gameid
	 * @param options.country - Two letter country ISO code, defaults to US
	 * @param options.shops - Only load prices from these shops, defaults to all shops
	 * @param options.since - Only load prices since this date, defaults last 3 months
	 * @returns
	 */
	async getHistoryLog(
		gameid: string,
		options: {
			country?: string
			shops?: number[]
			since?: Date
		} = {
			country: 'US',
			shops: undefined,
			since: undefined,
		},
	): Promise<HistoryLog[]> {
		let url = this.generateUrl('/history/v2', {
			country: options.country,
			shops: options.shops,
			id: gameid,
		})
		if (options.since) {
			// Remove milliseconds from ISO string otherwise it will be rejected by the API
			const isoString = options.since.toISOString().replace(/\.\d{3}Z$/, 'Z')
			url += `&since=${isoString}`
		}
		const response = await this.sendGETRequest<HistoryLog[]>(url)
		return response
	}

	async getBundlesIncludingGame(
		gameId: string,
		options: {
			country?: string
			expired?: boolean
		} = {
			country: 'US',
			expired: false,
		},
	): Promise<Bundle[]> {
		const url = this.generateUrl('/bundles/v2', { id: gameId, ...options })
		const response = await this.sendGETRequest<Bundle[]>(url)
		return response
	}

	/**
	 * Gets list of subscriptions the game is listed izn
	 * @param gameIds
	 * @param config
	 * @returns
	 */
	async getGameSubscriptions(
		gameIds: string[],
		config: {
			country?: string
		} = {
			country: 'US',
		},
	): Promise<GameSubscriptionsResponse> {
		const url = this.generateUrl(`/subs/v1`, config)
		const response = await this.sendPOSTRequest<GameSubscriptionsResponse>(
			url,
			gameIds,
		)
		return response
	}
}
