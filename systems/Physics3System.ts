import Physics3Able from 'sky/ables/Physics3Able'
import { Vector3 } from 'three/src/math/Vector3'

interface Physics3AbleEntity {
    Physics3Able: Physics3Able
}

export default class Movement3System {
    static Components = {
        entities: [Physics3Able],
    }

    entities: Physics3AbleEntity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Physics3AbleEntity, dt: number): void {
        const { position, velocity, acceleration, friction, linearFriction } = entity.Physics3Able

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
