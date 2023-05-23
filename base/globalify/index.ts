import globalify from './`globalify'
import * as local from './defaultly'

globalify({ globalify: local.default })

declare global {
    type globalify = local.default
    const globalify: typeof local.default
}
