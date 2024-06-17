@effect
export default class SmartPointerLock extends Effect {
    get isLocked(): boolean {
        return !!this.__pointerLock
    }

    constructor(deps: EffectDeps) {
        super(deps)

        new WindowEventListener(
            'mousedown',
            () => {
                if (this.__pointerLock) {
                    return
                }

                this.__pointerLock = new PointerLock(this)
                new DocumentEventListener(
                    'pointerlockchange',
                    () => {
                        new DocumentEventListener(
                            'pointerlockchange',
                            () => {
                                new Timeout(
                                    () => {
                                        this.__pointerLock.destroy()
                                        delete this.__pointerLock
                                    },
                                    2000,
                                    [this, this.__pointerLock]
                                )
                            },
                            [this, this.__pointerLock],
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

    private __pointerLock: PointerLock
}
