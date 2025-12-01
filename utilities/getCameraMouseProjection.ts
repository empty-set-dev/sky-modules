import Vector2 from '@sky-modules/math/Vector2'
import Vector3 from '@sky-modules/math/Vector3'

/**
 * Projects 2D mouse coordinates to 3D world coordinates on the z=0 plane.
 *
 * This function performs raycasting from the camera through the mouse position,
 * calculating where the ray intersects with the z=0 plane in 3D space.
 * Essential for mouse picking in 3D scenes.
 *
 * @param camera The Three.js camera (perspective or orthographic)
 * @param mouse Normalized mouse coordinates (typically from transformWindowCoordinates)
 * @returns 3D world position where mouse ray intersects z=0 plane
 *
 * @example Basic mouse picking
 * ```typescript
 * import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
 * import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
 * import Vector2 from '@sky-modules/math/Vector2'
 *
 * window.addEventListener('click', (e) => {
 *   const mouse = new Vector2(e.clientX, e.clientY)
 *   const normalized = transformWindowCoordinates(mouse)
 *   const worldPos = getCameraMouseProjection(camera, normalized)
 *
 *   console.log(`Clicked at world position: ${worldPos.x}, ${worldPos.y}`)
 * })
 * ```
 *
 * @example Interactive object placement
 * ```typescript
 * onFrame((dt) => {
 *   const mouse = new Vector2(mouseX, mouseY)
 *   const normalized = transformWindowCoordinates(mouse)
 *   const position = getCameraMouseProjection(camera, normalized)
 *
 *   // Position object under cursor
 *   previewObject.position.copy(position)
 * })
 * ```
 */
export default function getCameraMouseProjection(camera: Three.Camera, mouse: Vector2): Vector3 {
    const mouse3 = new Vector3(mouse.x, mouse.y, 0)
        .unproject(camera)
        .sub(camera.position)
        .normalize()
    const distance = -camera.position.z / mouse3.z
    return new Vector3().copy(camera.position).add(mouse3.multiplyScalar(distance))
}
