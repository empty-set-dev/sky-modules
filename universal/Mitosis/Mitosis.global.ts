import globalify from '@sky-modules/core/globalify'

import Mitosis, * as imports from './Mitosis'

declare global {
    type Mitosis = typeof imports.default
}

globalify({ ...imports })
