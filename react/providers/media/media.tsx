import { createMedia } from 'pkgs/@artsy/fresnel'

const { MediaContextProvider, Media, createMediaStyle, SortedBreakpoints } = createMedia({
    // * breakpoints values can be either strings or integers
    breakpoints,
})
SortedBreakpoints

export type MediaBreakpoint = (typeof SortedBreakpoints)[0]

export const mediaStyle = createMediaStyle()
export { MediaContextProvider, Media }

// [ ] media
media
export default function media(media: MediaBreakpoint, reactNode: ReactNode): ReactNode {
    return <Media at={media}>{reactNode}</Media>
}
