import LinearFriction3Able from 'ables/LinearFriction3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/math/Vector3'

interface LinearFriction3AbleEntity {
    Move3Able: Move3Able
    LinearFriction3Able: LinearFriction3Able
}

export default class LinearFriction3System {
    static Components = {
        entities: [Move3Able, LinearFriction3Able],
    }

    entities: LinearFriction3AbleEntity[] = []

    run(): void {
        this.entities.forEach(entity => this.update(entity))
    }

    update(entity: LinearFriction3AbleEntity): void {
        const { velocity } = entity.Move3Able
        const { linearFriction } = entity.LinearFriction3Able

        velocity.sub(new Vector3().copy(velocity).multiplyScalar(linearFriction.valueOf() / 100))
    }
}
