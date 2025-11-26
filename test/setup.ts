const apiKey = process.env.IS_THERE_ANY_DEAL_API_KEY

if (!apiKey) {
	throw new Error('IS_THERE_ANY_DEAL_API_KEY is not set')
}

export function getTestAppId() {
	// Witcher 3
	return `292030`
}

export function getTestGameTitle() {
	// Witcher 3
	return `The Witcher 3: Wild Hunt - Complete Edition`
}

export function getTestGameId() {
	// Witcher 3
	return `018d937f-3a29-72b9-888f-ecbf55a28e80`
}

export function getTestGameId2() {
	// Expedition 33
	return `018ffe0d-15a7-7247-bb3c-4e5e1980561f`
}

export function getTestShopId() {
	// Steam
	return 61
}

export function getApiKey(): string {
	if (!apiKey) {
		throw new Error('IS_THERE_ANY_DEAL_API_KEY is not set')
	}
	return apiKey
}
