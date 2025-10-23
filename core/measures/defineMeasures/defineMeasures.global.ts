import globalify from '@sky-modules/core/globalify'
import defineMeasures, * as imports from './defineMeasures'

declare global {
    type defineMeasures = typeof imports.default
    const defineMeasures: typeof imports.default
}

globalify({ defineMeasures, ...imports })
