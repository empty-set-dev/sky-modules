import globalify from '@sky-modules/core/globalify'

import * as imports from '../Vector2'

declare global {
    const Vector2: typeof imports.Vector2
}

globalify({ ...imports })
