import type { ShopListItem } from '../schemas/responses/shop.schema'
import { BaseService } from './_base.service'

export class ShopsService extends BaseService {
	constructor(apiKey: string) {
		super(apiKey, 'service/shops')
	}

	async getShops(
		options: { country?: string } = { country: 'US' },
	): Promise<ShopListItem[]> {
		const url = this.generateUrl(`/v1`, options)
		const response = await this.sendGETRequest<ShopListItem[]>(url)
		return response
	}
}
