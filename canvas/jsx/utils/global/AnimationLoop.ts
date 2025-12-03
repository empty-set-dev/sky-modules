import globalify from '@sky-modules/core/globalify'

import * as imports from '../AnimationLoop'

declare global {
    const AnimationLoop: typeof imports.AnimationLoop
}

globalify({ ...imports })
