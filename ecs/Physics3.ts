import 'sky/features/ecs/global'
import Vector3 from 'sky/math/Vector3'

declare global {
    interface Entity {
        physics3: Physics3
    }

    interface Systems {
        Physics3System: Physics3System
    }
}

class Physics3 extends Component {
    position: Vector3 = new Vector3()
    velocity: Vector3 = new Vector3()
    acceleration: Vector3 = new Vector3()
    friction: MetersPerSecond = (0).asMetersPerSecond
    linearFriction: PercentsPerMillisecond = (0).asPercentsPerMillisecond
}

defineComponent('physics3', Physics3)

class Physics3System extends System {
    static components = ['physics3']

    updateEntity(entity: Entity, ev: Sky.UpdateEvent): void {
        const { position, velocity, acceleration, friction, linearFriction } = entity.physics3

        velocity.add(new Vector3().copy(acceleration).multiplyScalar(ev.dt))
        position.add(new Vector3().copy(velocity).multiplyScalar(ev.dt))

        if (friction.valueOf() * ev.dt * friction.valueOf() * ev.dt >= velocity.lengthSq()) {
            velocity.set(0, 0, 0)
        } else {
            velocity.sub(
                new Vector3()
                    .copy(velocity)
                    .normalize()
                    .multiplyScalar(friction.valueOf() * ev.dt)
            )
        }

        velocity.multiplyScalar(Math.pow(1 - linearFriction.valueOf() * 0.01, ev.dt * 1000))
    }

    protected update(ev: Sky.UpdateEvent): void {
        for (const entity of this.entities) {
            this.updateEntity(entity, ev)
        }
    }
}

defineSystem('Physics3System', Physics3System)
