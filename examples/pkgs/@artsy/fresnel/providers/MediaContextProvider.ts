import { createMedia } from 'pkgs/@artsy/fresnel'

const { MediaContextProvider, Media, createMediaStyle } = createMedia({
    // breakpoints values can be either strings or integers
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
})

export const mediaStyle = createMediaStyle()
export default MediaContextProvider
export { Media }
