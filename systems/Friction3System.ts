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
        const { velocity } = entity.Move3Able
        const { friction } = entity.Friction3Able

        if ((friction * dt * friction * dt) / 1000000 >= velocity.lengthSq()) {
            velocity.set(0, 0, 0)
            return
        }

        velocity.sub(
            new Vector3()
                .copy(velocity)
                .normalize()
                .multiplyScalar((friction * dt) / 1000)
        )
    }
}
