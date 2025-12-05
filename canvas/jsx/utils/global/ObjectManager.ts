import globalify from '@sky-modules/core/globalify'

import * as imports from '../ObjectManager'

declare global {
    const ObjectManager: typeof imports.ObjectManager
}

globalify({ ...imports })
