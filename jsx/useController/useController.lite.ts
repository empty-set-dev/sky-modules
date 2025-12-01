/**
 * useController hook for Mitosis components
 *
 * A Mitosis hook for managing controller lifecycle in cross-framework components.
 * Controllers implement onChange/dispose pattern for external state synchronization.
 *
 * @module jsx/useController
 */
import { onMount, onUnMount, useState } from '@builder.io/mitosis'

/**
 * Controller interface
 *
 * Defines the contract for controllers that can be used with useController hook.
 */
export interface Controller {
    /**
     * Registers a change callback
     * @param callback - Function to call when controller state changes
     */
    onChange(callback: () => void): void

    /**
     * Cleans up controller resources
     * @returns Optional promise for async cleanup
     */
    dispose(): void | PromiseLike<void>
}

/**
 * Hook for managing controller lifecycle
 *
 * Connects external controllers to Mitosis components, automatically handling
 * change notifications and cleanup. Used for integrating state from external
 * sources (Canvas, Three.js, etc.) with reactive UI components.
 *
 * @template T - Controller type extending Controller interface
 * @returns Tuple of [controller, setController] similar to useState
 *
 * @example Canvas controller
 * ```typescript
 * import useController from '@sky-modules/jsx/useController'
 * import { CanvasController } from '@sky-modules/canvas'
 *
 * function MyComponent() {
 *   const [canvas, setCanvas] = useController<CanvasController>()
 *
 *   onMount(() => {
 *     const controller = new CanvasController()
 *     setCanvas(controller)
 *   })
 *
 *   return <div>Canvas size: {canvas?.width} x {canvas?.height}</div>
 * }
 * ```
 *
 * @example Three.js scene controller
 * ```typescript
 * function SceneComponent() {
 *   const [scene, setScene] = useController<SceneController>()
 *
 *   return (
 *     <div>
 *       Objects: {scene?.objectCount}
 *       FPS: {scene?.fps}
 *     </div>
 *   )
 * }
 * ```
 */
export default function useController<T extends Controller>(): [T | null, (controller: T) => void] {
    const [update, setUpdate] = useState(false)
    const [controller, setController] = useState<T | null>(null)

    onMount(() => {
        const updateComponent = (): void => setUpdate(!update)
        controller?.onChange(updateComponent)
    })

    onUnMount(() => {
        controller?.dispose()
    })

    return [controller, setController]
}
