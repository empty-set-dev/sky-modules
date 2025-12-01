/**
 * Animation frame loop manager that orchestrates callbacks synchronized with browser repaints.
 *
 * FrameLoop provides a centralized animation loop using requestAnimationFrame, managing multiple
 * callbacks and providing accurate timing information (delta time and total elapsed time).
 * The loop automatically starts when the first callback is subscribed and stops when all callbacks
 * are removed.
 *
 * @example Basic usage
 * ```typescript
 * import { frameLoop, onFrame } from '@sky-modules/behavior'
 *
 * // Subscribe to frame updates
 * const unsubscribe = onFrame((deltaTime, totalTime) => {
 *   console.log(`Delta: ${deltaTime}s, Total: ${totalTime}s`)
 *   updateAnimation(deltaTime)
 * })
 *
 * // Clean up when done
 * unsubscribe()
 * ```
 *
 * @example Manual control
 * ```typescript
 * const loop = new FrameLoop()
 *
 * loop.subscribe((dt, total) => {
 *   // Animation logic
 * })
 *
 * loop.start()  // Explicitly start
 * loop.stop()   // Explicitly stop
 * ```
 */
export default class FrameLoop {
    private callbacks = new Set<(deltaTime: number, totalTime: number) => void>()
    private isRunning = false
    private lastTime = 0
    private startTime = 0

    /**
     * Starts the animation loop.
     * Safe to call multiple times - will not restart if already running.
     */
    start(): void {
        if (this.isRunning) return

        this.isRunning = true
        this.startTime = performance.now()
        this.lastTime = this.startTime
        this.loop()
    }

    /**
     * Stops the animation loop.
     * The loop will complete the current frame before stopping.
     */
    stop(): void {
        this.isRunning = false
    }

    /**
     * Subscribes a callback to receive frame updates.
     * The loop automatically starts when the first callback is added.
     *
     * @param callback Function called on each frame with deltaTime (seconds since last frame)
     *                 and totalTime (seconds since loop started)
     * @returns Unsubscribe function to remove this callback
     *
     * @example
     * ```typescript
     * const unsubscribe = frameLoop.subscribe((dt, total) => {
     *   // Update game logic
     *   player.update(dt)
     * })
     *
     * // Later...
     * unsubscribe()
     * ```
     */
    subscribe(callback: (deltaTime: number, totalTime: number) => void): () => void {
        this.callbacks.add(callback)

        if (!this.isRunning) {
            this.start()
        }

        return () => {
            this.callbacks.delete(callback)

            if (this.callbacks.size === 0) {
                this.stop()
            }
        }
    }

    /**
     * Unsubscribes a callback from receiving frame updates.
     * The loop automatically stops when the last callback is removed.
     *
     * @param callback The callback function to remove
     */
    unsubscribe(callback: (deltaTime: number, totalTime: number) => void): void {
        this.callbacks.delete(callback)

        if (this.callbacks.size === 0) {
            this.stop()
        }
    }

    private loop = (): void => {
        if (!this.isRunning) return

        const currentTime = performance.now()
        const deltaTime = (currentTime - this.lastTime) / 1000
        const totalTime = (currentTime - this.startTime) / 1000

        this.lastTime = currentTime

        this.callbacks.forEach(callback => {
            try {
                callback(deltaTime, totalTime)
            } catch (error) {
                console.error('Error in frame callback:', error)
            }
        })

        requestAnimationFrame(this.loop)
    }
}

/**
 * Global singleton instance of FrameLoop for application-wide frame updates.
 *
 * @example
 * ```typescript
 * import { frameLoop } from '@sky-modules/behavior'
 *
 * frameLoop.subscribe((dt, total) => {
 *   // Your animation logic
 * })
 * ```
 */
export const frameLoop = new FrameLoop()

/**
 * Subscribes to the global frame loop with a callback.
 * Convenience function that wraps frameLoop.subscribe().
 *
 * @param callback Function called on each frame with timing information
 * @returns Unsubscribe function to stop receiving updates
 *
 * @example
 * ```typescript
 * import { onFrame } from '@sky-modules/behavior'
 *
 * const unsubscribe = onFrame((deltaTime, totalTime) => {
 *   console.log(`Frame: ${deltaTime}s`)
 * })
 * ```
 */
export function onFrame(callback: (deltaTime: number, totalTime: number) => void): () => void {
    return frameLoop.subscribe(callback)
}

/**
 * Direct unsubscribe method attached to onFrame function.
 * Alternative to calling the unsubscribe function returned by onFrame().
 */
onFrame.unsubscribe = (callback: (deltaTime: number, totalTime: number) => void): void => {
    frameLoop.unsubscribe(callback)
}
