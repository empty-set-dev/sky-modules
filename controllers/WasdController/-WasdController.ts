import { PerspectiveCamera, Vector3 } from 'three/src/Three'

export interface WasdControllerOptions {
    camera: PerspectiveCamera
    acceleration: Vector3
    force: number
}
export default class WasdController extends Link {
    force: number

    constructor(parent: Parent, options: WasdControllerOptions) {
        super(parent)

        const { acceleration, force } = options

        this.force = force

        const state: number[] = [0, 0, 0, 0]

        new PointerLock([this])

        const mouse = new Vector3()
        new EventListener(
            'mousemove',
            () => {
                mouse.x
            },
            [this]
        )

        let fullscreen: Fullscreen = null
        new EventListener(
            'keydown',
            ev => {
                if (ev.code === 'KeyEnter') {
                    if (fullscreen) {
                        fullscreen.destroy()
                        fullscreen = null
                    } else {
                        fullscreen = new Fullscreen([this])
                    }
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
            },
            [this]
        )

        new EventListener(
            'keyup',
            ev => {
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
            },
            [this]
        )
    }
}
