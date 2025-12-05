import globalify from '@sky-modules/core/globalify'

import SmartPointerLock, * as imports from '../SmartPointerLock'

declare global {
    const SmartPointerLock: typeof imports.default
    type SmartPointerLock = typeof imports.default
}

globalify({ SmartPointerLock })
