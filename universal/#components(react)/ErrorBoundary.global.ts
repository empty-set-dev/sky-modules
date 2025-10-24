import globalify from '@sky-modules/core/globalify'

import * as imports from './ErrorBoundary'

declare global {
    type ErrorBoundary = imports.default
}

globalify({ ...imports })
