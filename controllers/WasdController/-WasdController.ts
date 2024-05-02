import Vector2 from 'math/Vector2'
import Vector3 from 'math/Vector3'

export interface WasdControllerOptions {
    force?: number
    direction: Vector3
    onUpdate?: () => void
}
@effect
export default class WasdController extends Effect {
    acceleration = new Vector2()
    force: number
    direction: Vector3

    constructor(deps: EffectDeps, options: WasdControllerOptions) {
        super(deps)

        const { force, direction, onUpdate } = options

        this.force = force ?? 1
        this.direction = direction ?? new Vector3()

        const state: number[] = [0, 0, 0, 0]

        new EventListener(
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
