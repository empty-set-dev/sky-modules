import globalify from '@sky-modules/core/globalify'

import * as imports from '../Component'

declare global {
    const Component: typeof imports.Component
}

globalify({ ...imports })
