import Friction3Able from 'ables/Friction3Able'
import Move3Able from 'ables/Move3Able'
import { Vector3 } from 'three/src/Three'

export default class Movement3System {
    static Components = {
        entities: [Move3Able, Friction3Able],
    }

    entities: {
        Move3Able: Move3Able
        Friction3Able: Friction3Able
    }[] = []

    run(dt: number): void {
        this.entities.forEach(entity => {
            const movement = entity.Move3Able
            const friction = entity.Friction3Able

            if ((friction.value * dt * friction.value * dt) / 1000000 >= movement.lengthSq()) {
                movement.set(0, 0, 0)
                return
            }

            movement.sub(
                new Vector3()
                    .copy(movement)
                    .normalize()
                    .multiplyScalar((friction.value * dt) / 1000)
            )
        })
    }
}
