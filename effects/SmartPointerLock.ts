/**
 * Smart pointer lock manager with automatic re-locking
 *
 * Automatically requests pointer lock on first mouse click and manages
 * pointer lock lifecycle. Releases and cleans up after 2 seconds of unlock.
 *
 * Prevents multiple pointer lock instances and handles lock state transitions.
 *
 * @example Basic usage
 * ```typescript
 * const smartLock = new SmartPointerLock([effect])
 *
 * // User clicks -> pointer lock requested
 * // User presses ESC -> unlocked, waits 2s, then ready for re-lock
 * console.log(smartLock.isLocked) // Current lock state
 * ```
 *
 * @example Check lock state
 * ```typescript
 * if (smartLock.isLocked) {
 *     // Pointer is locked, can use mouse delta
 * }
 * ```
 */
export default class SmartPointerLock {
    readonly effect: Effect

    /** Current pointer lock state */
    isLocked = false

    /** Current PointerLock instance if active */
    get pointerLock(): PointerLock | undefined {
        return this.__pointerLock
    }

    private __pointerLock?: PointerLock

    /**
     * Create smart pointer lock
     *
     * @param dep - Effect dependency
     */
    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        new WindowEventListener('mousedown', this.__onMouseDown, [this.effect])
    }

    private __onMouseDown = (): void => {
        if (this.__pointerLock) {
            return
        }

        this.isLocked = true
        this.__pointerLock = new PointerLock(this.effect)
        new DocumentEventListener(
            'pointerlockchange',
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
            'SmartPointerLock ~ __onExitPointerLock: this pointer lock'
        )
        this.isLocked = false
        new Timeout(
            () => {
                assertIsNotUndefined(
                    this.__pointerLock,
                    'SmartPointerLock ~ __onExitPointerLock ~ Timeout: this pointer lock'
                )
                this.__pointerLock.effect.destroy()
                delete this.__pointerLock
            },
            (2).seconds,
            [this.__pointerLock.effect]
        )
    }
}
