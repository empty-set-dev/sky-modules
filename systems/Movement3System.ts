import Acceleration3Able from 'ables/Acceleration3Able'
import Friction3Able from 'ables/Friction3Able'
import LinearFriction3Able from 'ables/LinearFriction3Able'
import Move3Able from 'ables/Move3Able'
import Position3Able from 'ables/Position3Able'
import { Vector3 } from 'three/src/Three'

export default class Movement3System {
    static Components = {
        entities: [Position3Able, Move3Able],
        accelerationableEntities: [Move3Able, Acceleration3Able],
        frictionableEntities: [Move3Able, Friction3Able],
        linearFrictionableEntities: [Move3Able, LinearFriction3Able],
    }

    entities: {
        Position3Able: Position3Able
        Move3Able: Move3Able
    }[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            const position = entity.Position3Able
            const movement = entity.Move3Able
            position.add(new Vector3().copy(movement).multiplyScalar(dt / 1000))
        })
    }
}
