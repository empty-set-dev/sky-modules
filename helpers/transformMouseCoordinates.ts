import Vector2 from 'sky/math/Vector2'

export default function transformMouseCoordinates(ev: MouseEvent): Vector2 {
    return new Vector2(
        (ev.clientX / (window.innerWidth - 1)) * 2 - 1,
        -(ev.clientY / (window.innerHeight - 1)) * 2 + 1
    )
}
