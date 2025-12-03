import globalify from '@sky-modules/core/globalify'

import * as imports from '../box-demo'

declare global {
    const createBoxDemo: typeof imports.createBoxDemo
}

globalify({ ...imports })
