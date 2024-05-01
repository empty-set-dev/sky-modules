import Acceleration3Able from 'ables/Acceleration3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/math/Vector3'

interface Acceleration3AbleEntity {
    Move3Able: Move3Able
    Acceleration3Able: Acceleration3Able
}

export default class Acceleration3System {
    static Components = {
        entities: [Move3Able, Acceleration3Able],
    }

    entities: Acceleration3AbleEntity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Acceleration3AbleEntity, dt: number): void {
        const { velocity } = entity.Move3Able
        const { acceleration } = entity.Acceleration3Able

        velocity.add(new Vector3().copy(acceleration).multiplyScalar(dt / 1000))
    }
}
