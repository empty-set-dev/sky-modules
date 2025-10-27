import globalify from '@sky-modules/core/globalify'

import generateGlobalCommand, * as imports from './generate--global'

declare global {
    const generateGlobalCommand: typeof imports.default
    type generateGlobalCommand = typeof imports.default
}

globalify({ generateGlobalCommand })
