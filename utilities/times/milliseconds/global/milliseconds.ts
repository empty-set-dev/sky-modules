import globalify from '@sky-modules/core/globalify'

import * as imports from '../milliseconds'

declare global {
    const secondMs: typeof imports.secondMs
    const minuteMs: typeof imports.minuteMs
    const hourMs: typeof imports.hourMs
    const dayMs: typeof imports.dayMs
    const weekMs: typeof imports.weekMs
}

globalify({ ...imports })
