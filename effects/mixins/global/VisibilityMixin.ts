import globalify from '@sky-modules/core/globalify'

import * as imports from '../VisibilityMixin'

declare global {
    const VisibilityMixin: typeof imports.VisibilityMixin
}

globalify({ ...imports })
