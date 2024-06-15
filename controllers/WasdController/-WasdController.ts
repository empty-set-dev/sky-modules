import Vector2 from 'sky/math/Vector2'

export interface WasdControllerOptions {
    force?: number
    onUpdate?: () => void
}
export default class WasdController extends Effect {
    acceleration = new Vector2()
    force: number

    constructor(deps: EffectDeps, options: WasdControllerOptions) {
        super(deps)

        const { force, onUpdate } = options

        this.force = force ?? 1

        const state: number[] = [0, 0, 0, 0]

        new WindowEventListener(
            'keydown',
            ev => {
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

                this.acceleration
                    .set(state[2] - state[3], state[0] - state[1])
                    .normalize()
                    .multiplyScalar(this.force)

                onUpdate && onUpdate()
            },
            [this]
        )

        new WindowEventListener(
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

                this.acceleration
                    .set(state[2] - state[3], state[0] - state[1])
                    .normalize()
                    .multiplyScalar(this.force)

                onUpdate && onUpdate()
            },
            [this]
        )
    }
}
