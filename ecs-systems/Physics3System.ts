import Physics3Component from 'sky/ecs-components/Physics3Component'
import { Vector3 } from 'three/src/math/Vector3'

interface Physics3Entity {
    Physics3Component: Physics3Component
}

export default class Physics3System {
    static Components = {
        entities: [Physics3Component],
    }

    entities: Physics3Entity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Physics3Entity, dt: number): void {
        const { position, velocity, acceleration, friction, linearFriction } =
            entity.Physics3Component

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
