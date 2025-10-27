import globalify from '@sky-modules/core/globalify'

import generateMetaCommand, * as imports from './generate--meta'

declare global {
    const generateMetaCommand: typeof imports.default
    type generateMetaCommand = typeof imports.default
}

globalify({ generateMetaCommand })
