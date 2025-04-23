import 'sky/features/ecs/global'
import Vector3 from 'sky/math/Vector3'

declare global {
    interface Entity {
        physics3: Physics3
    }
}
class Physics3 {
    position: Vector3 = new Vector3()
    velocity: Vector3 = new Vector3()
    acceleration: Vector3 = new Vector3()
    friction: MetersPerSecond = MetersPerSecond(0)
    linearFriction: PercentsPerMillisecond = PercentsPerMillisecond(0)
}
defineComponent('physics3', Physics3)
