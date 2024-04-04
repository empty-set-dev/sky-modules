import { PerspectiveCamera, Vector3 } from 'three/src/Three'

export default class WasdController extends Effect {
    force: number

    constructor(
        link: Effects,
        options: { camera: PerspectiveCamera; acceleration: Vector3; force: number }
    ) {
        super(link)

        const { acceleration, force } = options

        this.force = force

        const state: number[] = [0, 0, 0, 0]

        new PointerLock(this)

        const mouse = new Vector3()
        new EventListener(this, 'mousemove', () => {
            mouse.x
        })

        let fullscreen: Effect = null
        new EventListener(this, 'keydown', ev => {
            if (ev.code === 'KeyEnter') {
                if (fullscreen) {
                    fullscreen.dispose()
                    fullscreen = null
                }

                fullscreen = Fullscreen(this)
            }

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

            acceleration
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

            acceleration
                .set(state[2] - state[3], state[0] - state[1], 0)
                .normalize()
                .multiplyScalar(this.force)
        })
    }
}
