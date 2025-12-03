import globalify from '@sky-modules/core/globalify'

import measurePerformance, * as imports from '../measurePerformance'

declare global {
    const measurePerformance: typeof imports.default
    type measurePerformance = typeof imports.default
}

globalify({ measurePerformance })
