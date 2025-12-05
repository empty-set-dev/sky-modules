import globalify from '@sky-modules/core/globalify'

import * as imports from '../defineComponent'

declare global {
    const defineComponent: typeof imports.defineComponent
}

globalify({ ...imports })
