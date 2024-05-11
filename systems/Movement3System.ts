import Move3Able from 'ables/Move3Able'
import Position3Able from 'ables/Position3Able'
import { Vector3 } from 'three/src/math/Vector3'

interface Movement3AbleEntity {
    Position3Able: Position3Able
    Move3Able: Move3Able
}

export default class Movement3System {
    static Components = {
        entities: [Position3Able, Move3Able],
    }

    entities: Movement3AbleEntity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            this.update(entity, dt)
        })
    }

    update(entity: Movement3AbleEntity, dt: number): void {
        const { position } = entity.Position3Able
        const { velocity } = entity.Move3Able

        position.add(new Vector3().copy(velocity).multiplyScalar(dt))
    }
}
