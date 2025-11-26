export abstract class BaseService {
	protected readonly _apiKey: string
	protected readonly route: string

	constructor(apiKey: string, route: string) {
		this._apiKey = apiKey
		this.route = route
	}

	get baseUrl(): string {
		return `https://api.isthereanydeal.com/${this.route}`
	}

	protected async sendPOSTRequest<T, S = unknown>(
		url: string,
		body: S,
	): Promise<T> {
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
			if (!response.ok) {
				console.error(response)
				throw new Error(`Failed to fetch ${url}: ${response.statusText}.`)
			}
			return response.json()
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	protected async sendGETRequest<T>(url: string): Promise<T> {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (!response.ok) {
				console.error(response)
				throw new Error(`Failed to fetch ${url}: ${response.statusText}.`)
			}
			return response.json()
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	protected generateUrl(
		link: string,
		params?: Record<
			string,
			string | number | boolean | undefined | string[] | number[]
		>,
	): string {
		const url = new URL(this.baseUrl + link)
		for (const [key, value] of Object.entries(params ?? {})) {
			if (value !== undefined) {
				url.searchParams.set(key, value.toString())
			}
		}
		url.searchParams.set('key', this._apiKey)
		return url.toString()
	}
}
