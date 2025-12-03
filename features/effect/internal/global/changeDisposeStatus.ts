import globalify from '@sky-modules/core/globalify'

import changeDisposeStatus, * as imports from '../changeDisposeStatus'

declare global {
    const changeDisposeStatus: typeof imports.default
    type changeDisposeStatus = typeof imports.default
}

globalify({ changeDisposeStatus })
