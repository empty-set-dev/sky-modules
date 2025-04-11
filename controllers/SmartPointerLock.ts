export default class SmartPointerLock {
    readonly effect: Effect
    isLocked = false

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps)

        new WindowEventListener(
            'mousedown',
            () => {
                if (this.__pointerLock) {
                    return
                }

                this.isLocked = true
                this.__pointerLock = new PointerLock(this.effect)
                new DocumentEventListener(
                    'pointerlockchange',
                    () => {
                        new DocumentEventListener(
                            'pointerlockchange',
                            () => {
                                this.isLocked = false
                                new Timeout(
                                    () => {
                                        this.__pointerLock!.destroy()
                                        delete this.__pointerLock
                                    },
                                    2000,
                                    [this.effect, this.__pointerLock!]
                                )
                            },
                            [this.effect, this.__pointerLock!],
                            { once: true }
                        )
                    },
                    [this.effect, this.__pointerLock],
                    { once: true }
                )
            },
            [this.effect]
        )
    }

    private __pointerLock?: PointerLock
}
