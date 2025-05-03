import { createMedia } from 'pkgs/@artsy/fresnel'
import breakpoints from '#/renderer/breakpoints'

const { MediaContextProvider, Media, createMediaStyle } = createMedia({
    // breakpoints values can be either strings or integers
    breakpoints,
})

export const mediaStyle = createMediaStyle()
export {MediaContextProvider,  Media }
