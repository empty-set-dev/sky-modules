import globalify from '@sky-modules/core/globalify'

import * as imports from '../PerformanceProfiler'

declare global {
    const PerformanceProfiler: typeof imports.PerformanceProfiler
    type RenderTiming = imports.RenderTiming
    type ProfilerStats = imports.ProfilerStats
}

globalify({ ...imports })
