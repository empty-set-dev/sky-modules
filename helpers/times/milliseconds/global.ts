import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify(pkg)

declare global {
    const secondMs: number
    const minuteMs: number
    const hourMs: number
    const dayMs: number
    const weekMs: number
}
