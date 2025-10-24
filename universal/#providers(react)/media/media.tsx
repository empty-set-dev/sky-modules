import { createMedia } from '@artsy/fresnel'
import { ReactNode } from 'react'

// @ts-expect-error import config/media.config
import breakpoints from '~project/configs/media.config'

const { MediaContextProvider, Media, createMediaStyle, SortedBreakpoints } = createMedia({
    // * breakpoints values can be either strings or integers
    breakpoints,
})
SortedBreakpoints

export type MediaBreakpoint = (typeof SortedBreakpoints)[0]

export const mediaStyle = createMediaStyle()
export { MediaContextProvider, Media }

// [ ] media
export default function media(media: MediaBreakpoint, reactNode: ReactNode): ReactNode {
    return <Media at={media}>{reactNode}</Media>
}
