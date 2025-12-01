import globalify from '@sky-modules/core/globalify'

import JSX, * as imports from '../JSX'

declare global {
    type JSX = imports.default
}

// No runtime values to globalize
