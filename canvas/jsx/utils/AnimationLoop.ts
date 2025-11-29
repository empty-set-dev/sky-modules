import { batch } from 'solid-js'

import CanvasRenderer from '../../core/CanvasRenderer'
import Group from '../../core/Group'
import Mesh from '../../core/Mesh'
import Scene from '../../core/Scene'

/**
 * Animation loop manager for Canvas JSX
 * Handles requestAnimationFrame loop, time tracking, and update callbacks
 *
 * Features:
 * - Automatic frame timing (time and delta calculation)
 * - Per-object update callbacks with reactive batching
 * - Custom frame callbacks for global updates
 * - Start/stop control for the animation loop
 *
 * @example
 * ```typescript
 * const loop = new AnimationLoop(canvas, scene, () => objects)
 *
 * // Add object update callback
 * loop.addUpdateCallback('cube', (obj, time, delta) => {
 *   obj.rotation += delta
 * })
 *
 * // Start animation
 * loop.start()
 * ```
 */
export class AnimationLoop {
    private frameId: number | null = null
    private clock = { start: Date.now(), lastTime: Date.now() }
    private updateCallbacks = new Map<string, (obj: any, time: number, delta: number) => void>()
    private frameCallback: (() => void) | null = null
    private canvas: CanvasRenderer
    private scene: Scene
    private objectsGetter: () => Map<string, Mesh | Group>

    constructor(canvas: CanvasRenderer, scene: Scene, objectsGetter: () => Map<string, Mesh | Group>) {
        this.canvas = canvas
        this.scene = scene
        this.objectsGetter = objectsGetter
    }

    /**
     * Add update callback for a specific object
     * @param key Object identifier
     * @param callback Function called on each frame with object, time and delta
     */
    addUpdateCallback(key: string, callback: (obj: any, time: number, delta: number) => void): void {
        this.updateCallbacks.set(key, callback)
    }

    /**
     * Remove update callback for an object
     * @param key Object identifier
     */
    deleteUpdateCallback(key: string): void {
        this.updateCallbacks.delete(key)
    }

    /**
     * Set custom frame callback executed before update callbacks
     * @param callback Function called on each frame, or null to remove
     */
    setFrameCallback(callback: (() => void) | null): void {
        this.frameCallback = callback
    }

    private animate = (): void => {
        this.frameId = requestAnimationFrame(this.animate)

        const now = Date.now()
        const time = (now - this.clock.start) / 1000
        const delta = (now - this.clock.lastTime) / 1000
        this.clock.lastTime = now

        // Call frame callback if set
        if (this.frameCallback) {
            this.frameCallback()
        }

        // Execute update callbacks inside batch to group all signal updates
        batch(() => {
            const objects = this.objectsGetter()
            this.updateCallbacks.forEach((callback, key) => {
                const obj = objects.get(key)
                if (obj && callback) {
                    callback(obj, time, delta)
                }
            })
        })

        // Render the scene
        this.canvas.render(this.scene)
    }

    /**
     * Start the animation loop
     * Does nothing if already running
     */
    start(): void {
        if (!this.frameId) {
            this.animate()
        }
    }

    /**
     * Stop the animation loop
     * Cancels the current animation frame request
     */
    stop(): void {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId)
            this.frameId = null
        }
    }

    /**
     * Get all registered update callbacks
     * @returns Map of object keys to their update callbacks
     */
    get callbacks(): Map<string, (obj: any, time: number, delta: number) => void> {
        return this.updateCallbacks
    }
}
