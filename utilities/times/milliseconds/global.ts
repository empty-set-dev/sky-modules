import globalify from 'utilities/globalify'

import * as module from './'

globalify(module)

declare global {
    const secondMs: number
    const minuteMs: number
    const hourMs: number
    const dayMs: number
    const weekMs: number
}
