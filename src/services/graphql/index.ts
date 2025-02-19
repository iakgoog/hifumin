import { createClient, defaultExchanges } from 'urql'
import { retryExchange } from '@urql/exchange-retry'

const url = 'https://api.opener.studio/graphql'

export const client = createClient({
	url,
	exchanges: [
		retryExchange({
			initialDelayMs: 500,
			maxDelayMs: 12000,
			maxNumberAttempts: 3,
			retryIf: (err) => !!err
		}),
		...defaultExchanges
	]
})

export const apiFetcher = <T extends Object>(
	endpointUrl: string,
	args: globalThis.RequestInit = {}
): Promise<T> => fetch(endpointUrl, args).then((res) => res.json())

export const jsonApiFetcher = <T extends Object>(
	endpointUrl: string,
	args: globalThis.RequestInit = {}
): Promise<T> =>
	apiFetcher(endpointUrl, {
		...args,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	})

export const { query } = client

export {
	getPreviews,
	getHentaiReaderById,
	getSimiliarHentaiById
} from './queries'

export type {
	HentaiQuery,
	GetHentaiById,
	GetHentaiByIdVariables,
	SearchHentai,
	SearchHentaiVariables
} from './queries/types'

export default client
