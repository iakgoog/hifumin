import { useEffect, useState } from 'react'

import { useStoreon } from 'storeon/react'
import { SearchEvent, SearchStore } from '@stores'

import Link from 'next/link'

import Cover from '@components/cover'

import { fetch } from '@libs'

import { Story } from '@types'

import './landing-cover.styl'

const LandingCover = () => {
	let { search } = useStoreon<SearchStore, SearchEvent>('search')

	let [story, updateStory] = useState<Story>(null)

	useEffect(() => {
		updateStory(null)
		fetch(`https://nhapi.now.sh/${search.trim()}`).then((story) =>
			updateStory(story)
		)
	}, [search])

	return (
		<Link href="/h/[h]" as={`/h/${search}`}>
			<a id="landing-cover">
				{story === null ? (
					<Cover preload={true} />
				) : (
					<Cover story={story} />
				)}
			</a>
		</Link>
	)
}

export default LandingCover