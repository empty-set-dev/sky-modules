import globalify from '@sky-modules/core/globalify'

import generateIndexCommand, * as imports from '../generate--index'

declare global {
    const generateIndexCommand: typeof imports.default
    type generateIndexCommand = typeof imports.default
}

globalify({ generateIndexCommand })
