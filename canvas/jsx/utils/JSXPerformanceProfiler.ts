/**
 * Performance profiling utility for JSX renderer
 */

export interface JSXRenderTiming {
    render: number
    cleanup: number
    sort: number
    canvas: number
    total: number
}

export interface JSXProfilerStats {
    renderCount: number
    lastStatsLog: number
    lastTimingLog: number
    timingLog: JSXRenderTiming[]
    cacheSize: number
    callbacksSize: number
    renderOrderSize: number
}

/**
 * Performance profiler for Canvas JSX rendering operations
 */
export class JSXPerformanceProfiler {
    private stats: JSXProfilerStats = {
        renderCount: 0,
        lastStatsLog: performance.now(),
        lastTimingLog: performance.now(),
        timingLog: [],
        cacheSize: 0,
        callbacksSize: 0,
        renderOrderSize: 0,
    }

    /**
     * Record a render timing
     */
    recordTiming(timing: JSXRenderTiming): void {
        this.stats.renderCount++
        this.stats.timingLog.push(timing)
    }

    /**
     * Update cache stats
     */
    updateCacheStats(cacheSize: number, callbacksSize: number, renderOrderSize: number): void {
        this.stats.cacheSize = cacheSize
        this.stats.callbacksSize = callbacksSize
        this.stats.renderOrderSize = renderOrderSize
    }

    /**
     * Log stats if enough time has passed
     */
    logStats(currentTime: number, intervalMs: number = 1000): void {
        if (currentTime - this.stats.lastStatsLog >= intervalMs) {
            console.log(
                `[CanvasJSX] Renders: ${this.stats.renderCount}/s | Cache: ${this.stats.cacheSize} | Callbacks: ${this.stats.callbacksSize} | RenderOrder: ${this.stats.renderOrderSize}`
            )
            this.stats.renderCount = 0
            this.stats.lastStatsLog = currentTime
        }
    }

    /**
     * Log timing stats if enough time has passed
     */
    logTimingStats(currentTime: number, intervalMs: number = 1000): void {
        if (currentTime - this.stats.lastTimingLog >= intervalMs && this.stats.timingLog.length > 0) {
            const avg = this.calculateAverages()
            const count = this.stats.timingLog.length

            console.log(
                `[Timing] Render: ${(avg.render / count).toFixed(2)}ms | Cleanup: ${(avg.cleanup / count).toFixed(2)}ms | Sort: ${(avg.sort / count).toFixed(2)}ms | Canvas: ${(avg.canvas / count).toFixed(2)}ms | Total: ${(avg.total / count).toFixed(2)}ms`
            )

            this.stats.timingLog = []
            this.stats.lastTimingLog = currentTime
        }
    }

    /**
     * Calculate average timings
     */
    private calculateAverages(): JSXRenderTiming {
        return this.stats.timingLog.reduce(
            (acc, t) => ({
                render: acc.render + t.render,
                cleanup: acc.cleanup + t.cleanup,
                sort: acc.sort + t.sort,
                canvas: acc.canvas + t.canvas,
                total: acc.total + t.total,
            }),
            { render: 0, cleanup: 0, sort: 0, canvas: 0, total: 0 }
        )
    }

    /**
     * Reset stats
     */
    reset(): void {
        this.stats = {
            renderCount: 0,
            lastStatsLog: performance.now(),
            lastTimingLog: performance.now(),
            timingLog: [],
            cacheSize: 0,
            callbacksSize: 0,
            renderOrderSize: 0,
        }
    }

    /**
     * Get current stats
     */
    getStats(): Readonly<JSXProfilerStats> {
        return this.stats
    }
}
