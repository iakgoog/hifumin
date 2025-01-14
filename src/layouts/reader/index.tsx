import tw from '@tailwind'

import { ReaderCover } from './components'

import type { ReaderLayoutComponent } from './types'

const twClass = {
	layout: tw`flex flex-col items-center w-full max-w-[760px] mx-auto p-0`,
	wrapper: tw`flex flex-col items-center w-full max-w-[560px] mx-auto`
} as const

const ReaderLayout: ReaderLayoutComponent = ({ children, story, isValid = true }) => {
	if (!isValid || typeof story === 'undefined')
		return (
			<article className={twClass.layout}>
				<section className={twClass.wrapper}>{children}</section>
			</article>
		)

	return (
		<article className={twClass.layout}>
			<ReaderCover story={story} />
			<section className={twClass.wrapper}>{children}</section>
		</article>
	)
}

export default ReaderLayout