import { createMedia } from 'pkgs/@artsy/fresnel'

import breakpoints from '#/renderer/+breakpoints'

const { MediaContextProvider, Media, createMediaStyle, SortedBreakpoints, findBreakpointAtWidth } = createMedia({
    // * breakpoints values can be either strings or integers
    breakpoints,
})

export type MediaBreakpoint = (typeof SortedBreakpoints)[0]

export const mediaStyle = createMediaStyle()
export { MediaContextProvider, Media }
// TODO...
function media(media: MediaBreakpoint, reactNode: ReactNode) {
    console.log(media, findBreakpointAtWidth(window.innerWidth))
}

export function Root(props: PropsWithChildren): ReactNode {
    return <>{media('sm', 123)}</>
}
