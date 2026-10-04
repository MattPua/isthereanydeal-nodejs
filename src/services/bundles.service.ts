import type { ApiKeyTransport } from '../client.types'
import type { Bundle } from '../schemas/responses/common.schema'
import { BaseService } from './_base.service'

export interface BundleListOptions {
	country?: string
	offset?: number
	limit?: number
	mature?: boolean
	expired?: boolean
	sort?: string
}

export class BundlesService extends BaseService {
	constructor(apiKey: string, apiKeyTransport: ApiKeyTransport = 'header') {
		super(apiKey, 'bundles', apiKeyTransport)
	}

	/**
	 * Gets bundles available on IsThereAnyDeal.
	 */
	async getBundles(options: BundleListOptions = {}): Promise<Bundle[]> {
		const url = this.generateUrl('/v1', {
			country: options.country,
			offset: options.offset,
			limit: options.limit,
			mature: options.mature,
			expired: options.expired,
			sort: options.sort,
		})
		return this.sendGETRequest<Bundle[]>(url)
	}
}
