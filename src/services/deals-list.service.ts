import type { DealsList } from '../schemas/responses/deals-list.schema'
import { BaseService } from './_base.service'

export class DealsListService extends BaseService {
	constructor(apiKey: string) {
		super(apiKey, 'deals')
	}

	/**
	 * Get current deals. Will not get one game more than once in the list. For each game, best price is displayed ,ignoring stores that currently dont have a sale even if they have a better price
	 *
	 * @param options.country Two letter country code (ISO 3166-1 alpha-2)
	 * @param options.offset The offset of the deals list. Min 0
	 * @param options.limit The limit of the deals list. Min 1, default 20, max 200
	 * @param options.sort The sort of the deals list. 'cut' for highest cut, 'price' for lowest price
	 * @param options.nondeals Load non sale prices
	 * @param options.mature Load prices for mature content
	 * @param options.shops The shops to include in the list Comma separated list of shop ids.
	 *
	 * @returns The deals list
	 */
	async getDeals(
		options: {
			country?: string
			offset?: number
			limit?: number
			sort?: 'cut' | 'price'
			nondeals?: boolean
			mature?: boolean
			shops?: string
		} = {
			offset: 0,
			limit: 20,
			sort: 'cut',
			nondeals: false,
			mature: false,
			shops: undefined,
		},
	): Promise<DealsList> {
		const url = this.generateUrl('/v2', options)
		const response = await this.sendGETRequest<DealsList>(url)
		return response
	}
}
