import globalify from '@sky-modules/core/globalify'

import * as imports from '../Box2'

declare global {
    const Box2: typeof imports.Box2
}

globalify({ ...imports })
