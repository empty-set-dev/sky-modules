import globalify from '@sky-modules/core/globalify'

import * as imports from '../Triangle'

declare global {
    const Triangle: typeof imports.Triangle
}

globalify({ ...imports })
