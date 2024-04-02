import globalify from 'utilities/globalify/globalify'

import * as module from './times'

globalify(module)

declare global {
    const secondMs: number
    const minuteMs: number
    const hourMs: number
    const dayMs: number
    const weekMs: number
}
