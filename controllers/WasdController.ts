import { Vector3 } from 'three'

export default class WasdController extends Effect {
    force: number

    constructor(link: Effects, target: Vector3, force: number) {
        super(link)

        this.force = force

        const state: number[] = [0, 0, 0, 0]

        new EventListener(this, 'keydown', ev => {
            if (ev.code === 'KeyW') {
                state[0] = 1
            }
            if (ev.code === 'KeyS') {
                state[1] = 1
            }
            if (ev.code === 'KeyD') {
                state[2] = 1
            }
            if (ev.code === 'KeyA') {
                state[3] = 1
            }

            target
                .set(state[2] - state[3], state[0] - state[1], 0)
                .normalize()
                .multiplyScalar(this.force)
        })

        new EventListener(this, 'keyup', ev => {
            if (ev.code === 'KeyW') {
                state[0] = 0
            }
            if (ev.code === 'KeyS') {
                state[1] = 0
            }
            if (ev.code === 'KeyD') {
                state[2] = 0
            }
            if (ev.code === 'KeyA') {
                state[3] = 0
            }

            target
                .set(state[2] - state[3], state[0] - state[1], 0)
                .normalize()
                .multiplyScalar(this.force)
        })
    }
}
