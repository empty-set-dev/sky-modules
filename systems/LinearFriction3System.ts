import LinearFriction3Able from 'ables/LinearFriction3Able'
import Move3Able from 'ables/Move3Able'

interface LinearFriction3AbleEntity {
    Move3Able: Move3Able
    LinearFriction3Able: LinearFriction3Able
}

export default class LinearFriction3System {
    static Components = {
        entities: [Move3Able, LinearFriction3Able],
    }

    entities: LinearFriction3AbleEntity[] = []

    run(dt: number): void {
        this.entities.forEach(entity => this.update(entity, dt))
    }

    update(entity: LinearFriction3AbleEntity, dt: number): void {
        const { velocity } = entity.Move3Able
        const { linearFriction } = entity.LinearFriction3Able

        velocity.multiplyScalar(Math.pow(1 - linearFriction.valueOf() * 0.01, dt * 0.001))
    }
}
