import { expect } from 'bun:test'

export const API_KEY = 'test-api-key'

export type MockFetchCall = {
	url: URL
	init: RequestInit
}

/** Replaces fetch for one test and restores it after the assertion. */
export async function withMockFetch<T>(
	responseBody: unknown,
	run: (calls: MockFetchCall[]) => Promise<T>,
): Promise<T> {
	const originalFetch = globalThis.fetch
	const calls: MockFetchCall[] = []

	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url =
			input instanceof Request ? new URL(input.url) : new URL(input.toString())
		calls.push({ url, init: init ?? {} })
		return new Response(JSON.stringify(responseBody), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	}) as typeof fetch

	try {
		return await run(calls)
	} finally {
		globalThis.fetch = originalFetch
	}
}

export function expectApiKeyHeader(call: MockFetchCall) {
	expect(call.init.headers).toMatchObject({ 'ITAD-API-Key': API_KEY })
	expect(call.url.searchParams.has('key')).toBe(false)
}
