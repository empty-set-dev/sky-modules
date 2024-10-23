export default class SmartPointerLock extends Effect {
    isLocked = false

    constructor(deps: EffectDeps) {
        super(deps)

        new WindowEventListener(
            'mousedown',
            () => {
                if (this.__pointerLock) {
                    return
                }

                this.isLocked = true
                this.__pointerLock = new PointerLock(this)
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
                                    [this, this.__pointerLock!]
                                )
                            },
                            [this, this.__pointerLock!],
                            { once: true }
                        )
                    },
                    [this, this.__pointerLock],
                    { once: true }
                )
            },
            [this]
        )
    }

    private __pointerLock?: PointerLock
}
