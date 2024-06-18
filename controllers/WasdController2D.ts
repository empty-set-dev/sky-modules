import Vector2 from 'sky/math/Vector2'

export interface WasdController2DOptions {
    force?: () => number
    direction?: () => number
    onUpdate?: () => void
}
export default class WasdController2D extends Effect {
    acceleration = new Vector2()
    angle: number
    force: () => number
    direction?: () => number

    constructor(deps: EffectDeps, options: WasdController2DOptions) {
        super(deps)

        const { force, direction, onUpdate } = options

        this.force = force ?? ((): number => 1)
        this.direction = direction ?? ((): number => 0)

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
                    .multiplyScalar(this.force())
                    .rotateAround(new Vector2(0, 0), this.direction())

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
                    .multiplyScalar(this.force())
                    .rotateAround(new Vector2(0, 0), this.direction())

                onUpdate && onUpdate()
            },
            [this]
        )
    }
}
