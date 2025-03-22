import Vector2 from 'sky/math/Vector2'

export default function transformMouseCoordinates(mouse: Vector2): Vector2 {
    return new Vector2(
        (mouse.x / (window.innerWidth - 1)) * 2 - 1,
        -(mouse.y / (window.innerHeight - 1)) * 2 + 1
    )
}
