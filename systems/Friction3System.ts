import Friction3Able from 'ables/Friction3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/math/Vector3'

interface Friction3AbleEntity {
    Move3Able: Move3Able
    Friction3Able: Friction3Able
}

export default class Friction3System {
    static Components = {
        entities: [Move3Able, Friction3Able],
    }

    entities: Friction3AbleEntity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Friction3AbleEntity, dt: number): void {
        const movement = entity.Move3Able
        const friction = entity.Friction3Able

        if ((friction.amount * dt * friction.amount * dt) / 1000000 >= movement.lengthSq()) {
            movement.set(0, 0, 0)
            return
        }

        movement.sub(
            new Vector3()
                .copy(movement)
                .normalize()
                .multiplyScalar((friction.amount * dt) / 1000)
        )
    }
}
