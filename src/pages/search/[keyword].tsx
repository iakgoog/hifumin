import { useEffect, useMemo, useReducer, useRef } from 'react'
import type { FunctionComponent } from 'react'

import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticProps } from 'next'

import type { CombinedError } from 'urql'

import { useAtom } from 'jotai'
import { searchAtom } from '@stores/search'

import DiscoverLayout from '@layouts/discover'

import SearchResults from '@molecules/search'
import OpenGraph from '@atoms/opengraph'

import { getPreviews } from '@services/graphql'
import { useComputedSpace } from '@services/hooks'

import type { Stories } from '@types'

let getKeyword = (keyword: string) => decodeURI(keyword.replace('/search/', ''))

export interface DiscoverProps {
	stories: Stories
	// ? Also used in search page
	keyword?: string
	error?: CombinedError | null
}

const Search: FunctionComponent<DiscoverProps> = ({
	stories: initial,
	keyword: initialKeyword
}) => {
	let [search, updateSearch] = useAtom(searchAtom)
	let [keywordChange, notifyKeywordChange] = useReducer(() => true, false)

	let layout = useRef<HTMLElement>(null)
	let spaces = useComputedSpace(layout)

	let { asPath } = useRouter()

	let keyword = useMemo(() => getKeyword(asPath), [])

	useEffect(() => {
		updateSearch(keyword)
	}, [])

	useEffect(() => {
		if (search && keyword !== search) notifyKeywordChange()
	}, [search])

	return (
		<>
			<OpenGraph
				title={`${
					search || initialKeyword || 'Search'
				} - Opener Studio`}
			/>
			<DiscoverLayout key="discover" layoutRef={layout}>
				<SearchResults
					key={search}
					initial={keywordChange ? [] : initial}
					spaces={spaces}
					layoutRef={layout}
				/>
			</DiscoverLayout>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [],
	fallback: true
})

export const getStaticProps: GetStaticProps<DiscoverProps> = async (
	context
) => {
	let { keyword } = context.params as {
		keyword: string
	}

	let stories = await getPreviews({
		keyword
	})

	return {
		props: {
			stories: stories.data?.searchHentai.data ?? [],
			keyword
		},
		revalidate: 3600 * 3
	}
}

export default Search
