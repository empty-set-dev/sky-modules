import globalify from '@sky-modules/core/globalify'

import previewWeb, * as imports from '../web--preview'

declare global {
    const previewWeb: typeof imports.default
    type previewWeb = typeof imports.default
}

globalify({ previewWeb })
