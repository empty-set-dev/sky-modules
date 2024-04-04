import Acceleration3Able from 'ables/Acceleration3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/math/Vector3'

export default class Acceleration33System {
    static Components = {
        entities: [Move3Able, Acceleration3Able],
    }

    entities: {
        Move3Able: Move3Able
        Acceleration3Able: Acceleration3Able
    }[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            const movement = entity.Move3Able
            const acceleration = entity.Acceleration3Able

            movement.add(new Vector3().copy(acceleration).multiplyScalar(dt / 1000))
        })
    }
}
