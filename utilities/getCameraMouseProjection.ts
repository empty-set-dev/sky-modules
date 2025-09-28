import Vector2 from '@sky-modules/math/Vector2'
import Vector3 from '@sky-modules/math/Vector3'

export default function getCameraMouseProjection(camera: Three.Camera, mouse: Vector2): Vector3 {
    const mouse3 = new Vector3(mouse.x, mouse.y, 0)
        .unproject(camera)
        .sub(camera.position)
        .normalize()
    const distance = -camera.position.z / mouse3.z
    return new Vector3().copy(camera.position).add(mouse3.multiplyScalar(distance))
}
