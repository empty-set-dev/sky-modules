import Vector2 from 'sky/math/Vector2'

export interface MouseControllerOptions {
    
}
export default class MouseController extends Effect {
    mouse: Vector2

    constructor(deps: EffectDeps, options: MouseControllerOptions) {
        super(deps)

        new WindowEventListener(
            'mousemove',
            ev => {
                this.mouse = new Vector2(
                    (ev.clientX / window.innerWidth) * 2 - 1,
                    -(ev.clientY / window.innerHeight) * 2 + 1
                )
            },
            this
        )
    }
}
