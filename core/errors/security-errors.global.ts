import globalify from '@sky-modules/core/globalify'

import * as imports from './security-errors'

declare global {
    const SecurityError: typeof imports.SecurityError
    type SecurityError = typeof imports.SecurityError
    const PrototypePollutionError: typeof imports.PrototypePollutionError
    type PrototypePollutionError = typeof imports.PrototypePollutionError
    const GlobalOverwriteError: typeof imports.GlobalOverwriteError
    type GlobalOverwriteError = typeof imports.GlobalOverwriteError
    const InvalidScopeError: typeof imports.InvalidScopeError
    type InvalidScopeError = typeof imports.InvalidScopeError
}

globalify({ ...imports })
