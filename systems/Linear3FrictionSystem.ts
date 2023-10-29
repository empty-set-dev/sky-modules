import LinearFriction3Able from 'ables/LinearFriction3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/Three'

interface MovableEntity {
    Move3Able: Move3Able
    LinearFriction3Able: LinearFriction3Able
}

export default class Movement3System {
    static Components = {
        entities: [Move3Able, LinearFriction3Able],
    }

    entities: MovableEntity[] = []

    run(): void {
        this.entities.forEach(entity => this.move(entity))
    }

    move(entity: MovableEntity): void {
        const movement = entity.Move3Able
        const friction = entity.LinearFriction3Able

        movement.sub(new Vector3().copy(movement).multiplyScalar(friction.value / 100))
    }
}
