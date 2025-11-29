/**
 * Performance profiling utility for tracking render timings
 */

export interface RenderTiming {
    clear: number
    reset: number
    background: number
    updateMatrix: number
    renderObjects: number
}

export interface ProfilerStats {
    renderCount: number
    lastStatsLog: number
    lastTimingLog: number
    timingLog: RenderTiming[]
}

/**
 * Performance profiler for Canvas rendering operations
 */
export class PerformanceProfiler {
    private stats: ProfilerStats = {
        renderCount: 0,
        lastStatsLog: performance.now(),
        lastTimingLog: performance.now(),
        timingLog: [],
    }

    /**
     * Record a render timing
     */
    recordTiming(timing: RenderTiming): void {
        this.stats.renderCount++
        this.stats.timingLog.push(timing)
    }

    /**
     * Log performance stats if enough time has passed
     */
    logStats(currentTime: number, intervalMs: number = 1000): void {
        if (currentTime - this.stats.lastTimingLog >= intervalMs && this.stats.timingLog.length > 0) {
            const avg = this.calculateAverages()
            const count = this.stats.timingLog.length

            console.log(
                `[CanvasRenderer] Clear: ${(avg.clear / count).toFixed(2)}ms | Reset: ${(avg.reset / count).toFixed(2)}ms | BG: ${(avg.background / count).toFixed(2)}ms | Matrix: ${(avg.updateMatrix / count).toFixed(2)}ms | Render: ${(avg.renderObjects / count).toFixed(2)}ms`
            )

            this.stats.timingLog = []
            this.stats.lastTimingLog = currentTime
        }
    }

    /**
     * Calculate average timings
     */
    private calculateAverages(): RenderTiming {
        return this.stats.timingLog.reduce(
            (acc, t) => ({
                clear: acc.clear + t.clear,
                reset: acc.reset + t.reset,
                background: acc.background + t.background,
                updateMatrix: acc.updateMatrix + t.updateMatrix,
                renderObjects: acc.renderObjects + t.renderObjects,
            }),
            { clear: 0, reset: 0, background: 0, updateMatrix: 0, renderObjects: 0 }
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
        }
    }

    /**
     * Get current stats
     */
    getStats(): Readonly<ProfilerStats> {
        return this.stats
    }
}
