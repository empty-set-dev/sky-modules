import globalify from '@sky-modules/core/globalify'

import brandBuild, * as imports from './design-system--build'

declare global {
    const brandBuild: typeof imports.default
    type brandBuild = typeof imports.default
}

globalify({ brandBuild })
