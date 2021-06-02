import { createClient, defaultExchanges } from 'urql'

export const client = createClient({
	url: 'https://api.opener.studio/graphql',
	exchanges: defaultExchanges
})

export const { query } = client

export { getPreviews, getHentaiReaderById } from './queries'

export type {
	HentaiQuery,
	GetHentaiById,
	GetHentaiByIdVariables,
	SearchHentai,
	SearchHentaiVariables
} from './queries/types'