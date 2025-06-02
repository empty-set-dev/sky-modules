export default class SmartPointerLock {
    readonly effect: Effect
    isLocked = false

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)

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
                                        this.__pointerLock!.effect.destroy()
                                        delete this.__pointerLock
                                    },
                                    Time(2, seconds),
                                    [this.__pointerLock!.effect]
                                )
                            },
                            [this.__pointerLock!.effect],
                            { once: true }
                        )
                    },
                    [this.__pointerLock.effect],
                    { once: true }
                )
            },
            [this.effect]
        )
    }

    private __pointerLock?: PointerLock
}
