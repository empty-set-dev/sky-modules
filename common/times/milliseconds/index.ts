import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify(local)

declare global {
    const secondMs: number
    const minuteMs: number
    const hourMs: number
    const dayMs: number
    const weekMs: number
}
