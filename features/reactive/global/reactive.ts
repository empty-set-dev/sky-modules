import globalify from '@sky-modules/core/globalify'

import * as imports from '../reactive'

declare global {
    const reactive: typeof imports.reactive
    const save: typeof imports.save
    const load: typeof imports.load
    const observe: typeof imports.observe
    const update: typeof imports.update
}

globalify({ ...imports })
