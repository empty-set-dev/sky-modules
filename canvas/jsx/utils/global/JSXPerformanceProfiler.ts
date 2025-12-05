import globalify from '@sky-modules/core/globalify'

import * as imports from '../JSXPerformanceProfiler'

declare global {
    const JSXPerformanceProfiler: typeof imports.JSXPerformanceProfiler
    type JSXRenderTiming = imports.JSXRenderTiming
    type JSXProfilerStats = imports.JSXProfilerStats
}

globalify({ ...imports })
