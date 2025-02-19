import { useEffect, useMemo, useReducer, useState } from 'react'

import { useRouter } from 'next/router'

import { useAtom } from 'jotai'
import { searchAtom } from '@stores/search'

import { DiscoverCard } from '@layouts/discover'

import tw, { combine } from '@tailwind'

import { ProgressIndicator } from '@atoms'

import {
	usePageEndObserver,
	useSearchHentai,
	useWindowSize
} from '@services/hooks'
import { splitChunk } from '@services/array'

import type { DiscoverComponents } from '@types'

import styles from './search-results.module.sass'

const SearchResults: DiscoverComponents = ({
	initial = [],
	spaces,
	layoutRef
}) => {
	let [keyword] = useAtom(searchAtom)
	let [isInit, init] = useReducer(() => true, false)

	let { stories, fetchMore, isLoading, isEnd } = useSearchHentai(keyword, !isInit)

	let [pageLoaded, updatePageState] = useState(false)
	let [windowSize] = useWindowSize()

	let storyGroups = useMemo(
		() => splitChunk(initial.concat(stories), spaces),
		[stories, spaces, initial]
	)

	usePageEndObserver(fetchMore, stories.length > 0 && isEnd)

	let { events } = useRouter()

	useEffect(() => {
		init()
	}, [initial])

	useEffect(() => {
		let changingRoute = () => {
			updatePageState(false)
		}

		let changedRoute = () => {
			updatePageState(true)
		}

		events.on('routeChangeStart', changingRoute)
		events.on('routeChangeComplete', changedRoute)

		return () => {
			events.off('routeChangeStart', changingRoute)
			events.off('routeChangeComplete', changingRoute)
		}
	}, [])

	useEffect(() => {
		let layout = layoutRef.current

		if (!layout) return

		if (layout.clientHeight < window.innerHeight && !isLoading) fetchMore()
	}, [layoutRef, fetchMore, isLoading, windowSize])

	if (!initial.length && keyword && !stories.length)
		if (isLoading || !pageLoaded)
			return (
				<section
					key="searching-layout"
					className={tw`flex flex-1 justify-center items-center pb-12`}
				>
					<ProgressIndicator />
				</section>
			)
		else
			return (
				<section
					key="search-not-found"
					className={tw`flex flex-1 flex-col justify-center items-center pb-12`}
				>
					<div
						className={combine(
							styles.shadow,
							tw`block w-full max-w-[480px] overflow-hidden rounded mb-6`
						)}
					>
						<div
							className={tw`block w-full aspect-w-16 aspect-h-9 bg-gray-200 rounded`}
						>
							<img
								className={tw`w-full object-cover object-center rounded`}
								src="/images/ame.jpg"
								alt="Not found"
							/>
						</div>
					</div>
					<h1
						className={tw`text-3xl font-medium text-gray-900 dark:text-gray-200 m-0 mb-3`}
					>
						Not Found
					</h1>
					<p className={tw`text-lg text-gray-500 m-0 mt-1`}>
						Maybe try another keyword?
					</p>
					<p className={tw`text-lg text-gray-500 m-0 mt-1`}>
						You can also use 6 digits code too.
					</p>
				</section>
			)

	return (
		<>
			{storyGroups.map((group, index) => (
				<section
					key={index.toString()}
					className={tw`flex flex-col flex-1 gap-4`}
				>
					{group.map((story) => (
						<DiscoverCard key={story.id} story={story} />
					))}
				</section>
			))}
		</>
	)
}

export default SearchResults
