import 'sky/features/#ecs/global'
import Vector3 from 'sky/math/Vector3'

export default class Physics3Component extends Component {
    position: Vector3 = new Vector3()
    velocity: Vector3 = new Vector3()
    acceleration: Vector3 = new Vector3()
    friction: MetersPerSecond = MetersPerSecond(0)
    linearFriction: PercentsPerMillisecond = PercentsPerMillisecond(0)
}
