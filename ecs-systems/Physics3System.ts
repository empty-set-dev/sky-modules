import 'sky/ecs-components/Physics3'
import Vector3 from 'sky/math/Vector3'

declare global {
    interface Systems {
        Physics3System: Physics3System
    }
}
class Physics3System extends System {
    static components = ['physics3']

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Entity, dt: number): void {
        const { position, velocity, acceleration, friction, linearFriction } = entity.physics3

        velocity.add(new Vector3().copy(acceleration).multiplyScalar(dt))
        position.add(new Vector3().copy(velocity).multiplyScalar(dt))

        if (friction.valueOf() * dt * friction.valueOf() * dt >= velocity.lengthSq()) {
            velocity.set(0, 0, 0)
        } else {
            velocity.sub(
                new Vector3()
                    .copy(velocity)
                    .normalize()
                    .multiplyScalar(friction.valueOf() * dt)
            )
        }

        velocity.multiplyScalar(Math.pow(1 - linearFriction.valueOf() * 0.01, dt * 1000))
    }
}
defineSystem('Physics3System', Physics3System)
