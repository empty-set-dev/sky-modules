import globalify from '@sky-modules/core/globalify'

import media, * as imports from '../media'

declare global {
    const media: typeof imports.default
    type media = typeof imports.default
    const mediaStyle: typeof imports.mediaStyle
    const MediaContextProvider: typeof imports.MediaContextProvider
    const Media: typeof imports.Media
    type MediaBreakpoint = imports.MediaBreakpoint
}

globalify({ media, ...imports })
