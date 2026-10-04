import type { ApiKeyTransport } from '../client.types'
import type {
	ShopListItem,
	ShopMapItem,
} from '../schemas/responses/shop.schema'
import { BaseService } from './_base.service'

export class ShopsService extends BaseService {
	constructor(apiKey: string, apiKeyTransport: ApiKeyTransport = 'header') {
		super(apiKey, 'service/shops', apiKeyTransport)
	}

	async getShops(
		options: { country?: string } = { country: 'US' },
	): Promise<ShopListItem[]> {
		const url = this.generateUrl(`/v1`, options)
		const response = await this.sendGETRequest<ShopListItem[]>(url)
		return response
	}

	/**
	 * Gets the complete shop map, including inactive shops.
	 */
	async getShopMap(): Promise<ShopMapItem[]> {
		const url = this.generateUrl('/map/v1')
		return this.sendGETRequest<ShopMapItem[]>(url)
	}
}
