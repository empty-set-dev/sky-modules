export default class SmartPointerLock {
    readonly effect: Effect
    isLocked = false
    get pointerLock(): PointerLock | undefined {
        return this.__pointerLock
    }

    private __pointerLock?: PointerLock

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)

        new WindowEventListener('mousedown', this.__onMouseDown, [this.effect])
    }

    private __onMouseDown = (): void => {
        if (this.__pointerLock != null) {
            return
        }

        this.isLocked = true
        this.__pointerLock = new PointerLock(this.effect)
        new DocumentEventListener(
            'pointerlockchange',
            // [ ] bench bind vs [this, this.method]
            () => {
                assertIsNotUndefined(
                    this.__pointerLock,
                    'SmartPointerLock ~ __onMouseDown ~ pointerlockchange: this.__pointerLock'
                )
                new DocumentEventListener(
                    'pointerlockchange',
                    this.__onExitPointerLock,
                    [this.__pointerLock.effect],
                    { once: true }
                )
            },
            [this.__pointerLock.effect],
            { once: true }
        )
    }

    private __onExitPointerLock = (): void => {
        assertIsNotUndefined(
            this.__pointerLock,
            'SmartPointerLock ~ __onExitPointerLock: this.__pointerLock'
        )
        this.isLocked = false
        new Timeout(
            () => {
                assertIsNotUndefined(
                    this.__pointerLock,
                    'SmartPointerLock ~ __onExitPointerLock ~ Timeout: this.__pointerLock'
                )
                this.__pointerLock.effect.destroy()
                delete this.__pointerLock
            },
            (2).seconds,
            [this.__pointerLock.effect]
        )
    }
}
