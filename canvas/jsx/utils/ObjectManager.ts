import Group from '../../core/Group'
import Mesh from '../../core/Mesh'
import Scene from '../../core/Scene'

/**
 * Object lifecycle manager for Canvas JSX
 * Manages object caching, render order, and cleanup for JSX components
 *
 * Features:
 * - Object caching for reuse across renders
 * - Render order tracking for proper z-index
 * - Automatic cleanup of unused objects
 * - Scene hierarchy management
 *
 * @example
 * ```typescript
 * const manager = new ObjectManager(scene)
 *
 * // Mark object as used in this render
 * manager.markKeyUsed('box-1', 0)
 *
 * // Get cached object or create new
 * let obj = manager.getCached('box-1')
 * if (!obj) {
 *   obj = new Mesh()
 *   manager.cache('box-1', obj)
 * }
 *
 * // Cleanup unused objects
 * manager.cleanupUnusedObjects(updateCallbacks)
 * ```
 */
export class ObjectManager {
    private objects = new Map<string, Mesh | Group>()
    private objectCache = new Map<string, Mesh | Group>()
    private usedKeys = new Set<string>()
    private renderOrder = new Map<string, number>()
    private scene: Scene

    constructor(scene: Scene) {
        this.scene = scene
    }

    /**
     * Mark object key as used in current render cycle
     * @param key Object identifier
     * @param order Render order (lower values render first)
     */
    markKeyUsed(key: string, order: number): void {
        this.usedKeys.add(key)
        this.renderOrder.set(key, order)
    }

    /**
     * Get cached object by key
     * @param key Object identifier
     * @returns Cached object or undefined if not found
     */
    getCached(key: string): Mesh | Group | undefined {
        return this.objectCache.get(key)
    }

    /**
     * Cache object for reuse
     * @param key Object identifier
     * @param obj Object to cache
     */
    cache(key: string, obj: Mesh | Group): void {
        this.objectCache.set(key, obj)
        this.objects.set(key, obj)
    }

    /**
     * Get object by key
     * @param key Object identifier
     * @returns Object or undefined if not found
     */
    get(key: string): Mesh | Group | undefined {
        return this.objects.get(key)
    }

    /**
     * Set object by key
     * @param key Object identifier
     * @param obj Object to set
     */
    set(key: string, obj: Mesh | Group): void {
        this.objects.set(key, obj)
    }

    /**
     * Clear used keys set for next render cycle
     */
    clearUsedKeys(): void {
        this.usedKeys.clear()
    }

    /**
     * Remove objects that weren't used in this render cycle
     * Also removes associated update callbacks
     * @param updateCallbacks Map of update callbacks to clean up
     */
    cleanupUnusedObjects(updateCallbacks: Map<string, (obj: any, time: number, delta: number) => void>): void {
        for (const [key, obj] of this.objectCache) {
            if (!this.usedKeys.has(key)) {
                if (obj.parent) {
                    obj.parent.remove(obj)
                }

                this.objectCache.delete(key)
                this.objects.delete(key)
                updateCallbacks.delete(key)
            }
        }
    }

    /**
     * Sort scene children according to render order
     * Objects with lower order values appear first (behind)
     */
    sortSceneChildren(): void {
        this.scene.children.sort((a, b) => {
            const aKey = [...this.objects.entries()].find(([, obj]) => obj === a)?.[0]
            const bKey = [...this.objects.entries()].find(([, obj]) => obj === b)?.[0]

            const aOrder = aKey !== undefined ? (this.renderOrder.get(aKey) ?? Infinity) : Infinity
            const bOrder = bKey !== undefined ? (this.renderOrder.get(bKey) ?? Infinity) : Infinity

            return aOrder - bOrder
        })
    }

    /**
     * Clear all objects from scene and caches
     * Removes all objects from scene and resets all internal maps
     */
    clearAll(): void {
        const objectsToRemove = [...this.scene.children]
        objectsToRemove.forEach(obj => this.scene.remove(obj))

        this.objects.clear()
        this.objectCache.clear()
        this.usedKeys.clear()
    }

    /**
     * Get number of cached objects
     */
    get cacheSize(): number {
        return this.objectCache.size
    }

    /**
     * Get number of objects with update callbacks
     */
    get updateCallbacksSize(): number {
        return this.objects.size
    }

    /**
     * Get number of objects with render order
     */
    get renderOrderSize(): number {
        return this.renderOrder.size
    }

    /**
     * Get all managed objects
     * @returns Map of all objects by their keys
     */
    getAllObjects(): Map<string, Mesh | Group> {
        return this.objects
    }
}
