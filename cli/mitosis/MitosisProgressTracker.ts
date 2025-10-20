import fs from 'fs'
import path from 'path'

import Console, { green, reset } from '../utilities/Console'

interface BuildTimeCache {
    fullBuildTime?: number
    fullBuildComponents?: number
    incrementalTimePerFile?: number
}

export class MitosisProgressTracker {
    private componentCount = 0
    private totalComponents = 0
    private spinnerInterval: NodeJS.Timeout | null = null
    private startTime = 0
    private lastBuildTime = 0
    private cacheFile: string
    private cancelled = false
    private isFullBuild = false

    constructor(componentCount: number, totalComponents: number, appId: string) {
        this.componentCount = componentCount
        this.totalComponents = totalComponents
        this.isFullBuild = componentCount === totalComponents
        this.cacheFile = path.resolve(`.dev/mitosis/${appId}/build-time.json`)
        this.loadLastBuildTime()
    }

    private loadLastBuildTime(): void {
        try {
            if (fs.existsSync(this.cacheFile)) {
                const data: BuildTimeCache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'))

                if (this.isFullBuild && data.fullBuildTime) {
                    // Use full build time
                    this.lastBuildTime = data.fullBuildTime
                } else if (!this.isFullBuild && data.incrementalTimePerFile) {
                    // Use incremental time per file
                    this.lastBuildTime = data.incrementalTimePerFile * this.componentCount
                }
            }
        } catch {
            // Ignore errors
        }
    }

    private saveLastBuildTime(duration: number): void {
        try {
            const dir = path.dirname(this.cacheFile)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            // Load existing cache
            let cache: BuildTimeCache = {}
            if (fs.existsSync(this.cacheFile)) {
                try {
                    cache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'))
                } catch {
                    // Ignore parse errors
                }
            }

            if (this.isFullBuild) {
                // Save full build time
                cache.fullBuildTime = duration
                cache.fullBuildComponents = this.componentCount
            } else {
                // Calculate and save average time per file for incremental builds
                const timePerFile = duration / this.componentCount
                // Use exponential moving average if we have previous data
                if (cache.incrementalTimePerFile) {
                    cache.incrementalTimePerFile = cache.incrementalTimePerFile * 0.7 + timePerFile * 0.3
                } else {
                    cache.incrementalTimePerFile = timePerFile
                }
            }

            fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2))
        } catch {
            // Ignore errors
        }
    }

    startSpinner(): void {
        this.startTime = Date.now()
        const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        let index = 0

        this.spinnerInterval = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000
            const spinner = spinnerChars[index % spinnerChars.length]

            if (this.lastBuildTime > 0) {
                // Show progress bar based on last build time
                const progress = Math.min(elapsed / this.lastBuildTime, 1)
                const percentage = Math.floor(progress * 100)
                const barLength = 20
                const filled = Math.floor(progress * barLength)
                const empty = barLength - filled
                const bar = `${green}${'█'.repeat(filled)}${reset}${'░'.repeat(empty)}`

                Console.write(
                    `\r${spinner} [${bar}] ${percentage}% ${elapsed.toFixed(1)}s / ~${this.lastBuildTime.toFixed(1)}s (${this.componentCount} files)`
                )
            } else {
                // No previous build time, just show spinner
                Console.write(
                    `\r${spinner} Building... ${elapsed.toFixed(1)}s (${this.componentCount} files)`
                )
            }

            index++
        }, 80)
    }

    complete(): void {
        if (this.spinnerInterval) {
            clearInterval(this.spinnerInterval)
            this.spinnerInterval = null
        }

        // Only save build time if build wasn't cancelled
        if (!this.cancelled) {
            const duration = (Date.now() - this.startTime) / 1000
            this.saveLastBuildTime(duration)
        }

        Console.write('\r' + ' '.repeat(100) + '\r\n')
    }

    clear(): void {
        this.cancelled = true

        if (this.spinnerInterval) {
            clearInterval(this.spinnerInterval)
            this.spinnerInterval = null
        }

        Console.write('\r' + ' '.repeat(100) + '\r')
    }
}
