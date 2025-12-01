import Vector2 from '@sky-modules/math/Vector2'

/**
 * Transforms window pixel coordinates to normalized device coordinates (NDC).
 *
 * Converts screen-space coordinates (0 to window size) to NDC space (-1 to 1),
 * with (0,0) at the center, x increasing right, and y increasing upward.
 * This is the standard coordinate system used by WebGL and Three.js for raycasting.
 *
 * @param mouse Window coordinates in pixels (origin at top-left)
 * @returns Normalized coordinates in range [-1, 1] (origin at center)
 *
 * @example Mouse event handling
 * ```typescript
 * import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
 * import Vector2 from '@sky-modules/math/Vector2'
 *
 * window.addEventListener('mousemove', (e) => {
 *   const windowCoords = new Vector2(e.clientX, e.clientY)
 *   const normalized = transformWindowCoordinates(windowCoords)
 *
 *   console.log(`NDC: (${normalized.x}, ${normalized.y})`)
 *   // e.g., center of screen: NDC: (0, 0)
 *   // top-left corner: NDC: (-1, 1)
 *   // bottom-right corner: NDC: (1, -1)
 * })
 * ```
 *
 * @example Three.js raycasting
 * ```typescript
 * import { Raycaster } from 'three'
 *
 * const raycaster = new Raycaster()
 *
 * function onMouseClick(e: MouseEvent) {
 *   const mouse = new Vector2(e.clientX, e.clientY)
 *   const ndc = transformWindowCoordinates(mouse)
 *
 *   raycaster.setFromCamera(ndc, camera)
 *   const intersects = raycaster.intersectObjects(scene.children)
 *
 *   if (intersects.length > 0) {
 *     console.log('Clicked object:', intersects[0].object)
 *   }
 * }
 * ```
 *
 * @example Combined with camera projection
 * ```typescript
 * import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
 *
 * const mouse = new Vector2(e.clientX, e.clientY)
 * const ndc = transformWindowCoordinates(mouse)
 * const worldPos = getCameraMouseProjection(camera, ndc)
 * ```
 */
export default function transformWindowCoordinates(mouse: Vector2): Vector2 {
    return new Vector2(
        (mouse.x / (window.innerWidth - 1)) * 2 - 1,
        -(mouse.y / (window.innerHeight - 1)) * 2 + 1
    )
}
