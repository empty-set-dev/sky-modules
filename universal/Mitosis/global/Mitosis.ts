import globalify from '@sky-modules/core/globalify'

import Mitosis, * as imports from '../Mitosis'

declare global {
    type Mitosis = imports.default
}

// No runtime values to globalize
