import '@sky-modules/core/measures/global'
import '@sky-modules/utilities/Timer/global'
import '@sky-modules/helpers/Loop/global'
import '../../effects/dom/_standard-effects'
import '@sky-modules/core/hooks'

import { assertIsNotUndefined } from '@sky-modules/core'
import Vector2 from '@sky-modules/math/Vector2'
import { runsOnServerSide } from '@sky-modules/platform/runsOnSide'

import ContextConstructor from './ContextConstructor'
import internal from './internal'

/**
 * Root effect class that manages the entire effect tree and provides global event handling.
 *
 * EffectThree serves as the root of the effect hierarchy and coordinates:
 * - Animation frame and update loops
 * - Global input handling (mouse, keyboard, gamepad)
 * - Batch processing of effect operations
 * - Event coordination across the effect tree
 *
 * @example
 * ```typescript
 * const root = new EffectThree()
 *   .registerUpdateEvents()
 *   .registerMouseEvents()
 *   .registerEmitKeyboardEvents()
 *   .registerGamepadEvents()
 * ```
 */
export default class EffectThree extends internal.BaseOfEffect {
    /** Current state of the left mouse button */
    isLeftMousePressed: boolean = false
    /** Current state of the middle mouse button */
    isMiddleMousePressed: boolean = false
    /** Current state of the right mouse button */
    isRightMousePressed: boolean = false
    /** Map of currently pressed keyboard keys by their codes */
    isPressed: Record<string, boolean> = {}
    /** Whether a pointer event has been captured in the current frame */
    isPointerEventCaptured = false

    /** Map of connected gamepads by their indices */
    gamepadStates: Record<number, Gamepad> = {}
    /** Map of currently pressed gamepad buttons */
    gamepadButtonPressed: Record<string, boolean> = {}

    /**
     * Gets the gamepad at the specified index.
     * @param index The gamepad index (default: 0)
     * @returns The gamepad instance or null if not connected
     */
    getGamepad(index: number = 0): Gamepad | null {
        return this.gamepadStates[index] || null
    }

    /**
     * Checks if a specific gamepad button is currently pressed.
     * @param gamepadIndex The index of the gamepad
     * @param buttonIndex The index of the button
     * @returns True if the button is currently pressed
     */
    isGamepadButtonPressed(gamepadIndex: number, buttonIndex: number): boolean {
        const buttonKey = `gamepad-${gamepadIndex}-button-${buttonIndex}`
        return this.gamepadButtonPressed[buttonKey] || false
    }

    /**
     * Identifies this instance as an EffectThree.
     * @returns Always true for EffectThree instances
     */
    get isEffectThree(): boolean {
        return true
    }

    /**
     * Returns this instance as the root of the effect tree.
     * @returns This EffectThree instance
     */
    get root(): EffectThree {
        return this
    }

    private __pendingAddParentOperations: internal.ParentOperationData[] = []
    private __pendingRemoveParentOperations: internal.ParentOperationData[] = []
    private __pendingAddDependencyOperations: internal.DependencyOperationData[] = []
    private __pendingRemoveDependencyOperations: internal.DependencyOperationData[] = []
    private __pendingAddContextOperations: internal.ContextOperationData[] = []
    private __pendingRemoveContextOperations: internal.ContextOperationData[] = []

    private __timer: Timer = new Timer()

    /**
     * Commits all pending operations (parent/child relationships, dependencies, contexts).
     * This method processes all queued operations in the correct order to maintain consistency.
     */
    commit(): void {
        for (const operation of this.__pendingRemoveParentOperations) {
            if (operation.child.disposed || operation.parent.disposed) {
                continue
            }

            assertIsNotUndefined(
                operation.parent['_children'],
                'Effect ~ removeParents: parent children'
            )
            operation.parent['_children'].remove(operation.child)

            if (operation.parent['_contexts']) {
                operation.child['__removeContexts'](operation.parent['_contexts'])
            }

            operation.child['__parents'].remove(operation.parent)

            if (operation.child['__parents'].length === 0) {
                operation.child.dispose()
            }
        }

        for (const operation of this.__pendingRemoveDependencyOperations) {
            if (operation.effect.disposed) {
                continue
            }

            if (Array.isArray(operation.dependency)) {
                const Context = operation.dependency[1]
                const contextOwner = operation.dependency[0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('Effect ~ removeDeps: context missing')
                }

                contextOwner['_contextEffectsMap']?.[Context.name]?.remove(operation.effect)
            } else {
                if (operation.dependency.disposed) {
                    continue
                }

                operation.effect['__dependencies']?.remove(operation.dependency)
                operation.dependency['_effects']?.remove(operation.effect)
            }
        }

        for (const operation of this.__pendingRemoveContextOperations) {
            if (operation.target.disposed) {
                continue
            }

            const Context = operation.context.constructor as ContextConstructor

            if (Context.context == null) {
                throw new Error('class missing context property')
            }

            operation.target['_contexts'] ??= {}
            delete operation.target['_contexts'][Context.name]

            if (this._children) {
                for (const child of this._children) {
                    child['__removeContexts']({ [Context.name]: operation.context })
                }
            }
        }

        for (const operation of this.__pendingAddParentOperations) {
            if (operation.child.disposed || operation.parent.disposed) {
                continue
            }

            operation.parent['_children'] ??= []
            operation.parent['_children'].push(operation.child)

            if (operation.parent['_contexts']) {
                operation.child['__initContexts']()
            }

            operation.child['__parents'].push(operation.parent)
        }

        for (const operation of this.__pendingAddDependencyOperations) {
            if (operation.effect.disposed) {
                continue
            }

            operation.effect['__dependencies'] ??= []

            if (Array.isArray(operation.dependency)) {
                const Context = operation.dependency[1]
                const contextOwner = operation.dependency[0]
                const context = contextOwner.context(Context)

                if (!context) {
                    throw new Error('Effect ~ addDeps: context missing')
                }

                contextOwner['_contextEffectsMap'] ??= {}
                contextOwner['_contextEffectsMap'][Context.name] ??= []
                contextOwner['_contextEffectsMap'][Context.name].push(operation.effect)
            } else {
                if (operation.dependency.disposed) {
                    continue
                }

                operation.effect['__dependencies'] ??= []
                operation.effect['__dependencies'].push(operation.dependency)
                operation.dependency['_effects'] ??= []
                operation.dependency['_effects'].push(operation.effect)
            }
        }

        for (const operation of this.__pendingAddContextOperations) {
            if (operation.target.disposed) {
                continue
            }

            const Context = operation.context.constructor as ContextConstructor

            if (Context.context == null) {
                throw new Error('class missing context property')
            }

            this._contexts ??= {}
            this._contexts[Context.name] = operation.context

            if (this._children) {
                for (const child of this._children) {
                    child['__addContexts']({
                        [Context.name]: operation.context,
                    })
                }
            }
        }
    }

    /**
     * Registers update event handlers that run on every frame.
     * Emits beforeUpdate, update, and afterUpdate events.
     * @param options Configuration object
     * @param options.before Optional callback to run before update events
     * @param options.after Optional callback to run after update events
     * @returns This EffectThree instance for method chaining
     */
    registerUpdateEvents({
        before,
        after,
    }: {
        before?: null | (() => void)
        after?: null | (() => void)
    }): this {
        this.__timer.reset()

        if (runsOnServerSide) {
            new Loop(
                (1 / 50).seconds,
                () => {
                    const dt = this.__timer.deltaTime().inSeconds
                    before && before()
                    this.emit('beforeUpdate', { dt })
                    this.emit('update', { dt })
                    this.emit('afterUpdate', { dt })
                    after && after()
                },
                this
            )
        } else {
            new AnimationFrames(() => {
                const dt = this.__timer.deltaTime().inSeconds
                before && before()
                this.emit('beforeUpdate', { dt })
                this.emit('update', { dt })
                this.emit('afterUpdate', { dt })
                this.emit('beforeAnimationFrame', { dt })
                this.emit('onAnimationFrame', { dt })
                this.emit('afterAnimationFrame', { dt })
                after && after()
                this.isPointerEventCaptured = false
            }, this)
        }

        return this
    }

    /**
     * Registers mouse event handlers for global mouse interactions.
     * Handles mousemove, mousedown, mouseup, click, and wheel events.
     * @param options Configuration object
     * @param options.before Optional callback to transform mouse coordinates
     * @param options.after Optional callback to run after mouse events
     * @returns This EffectThree instance for method chaining
     */
    registerMouseEvents({
        before,
        after,
    }: {
        before?: (mouse: Vector2) => Vector2
        after?: (mouse: Vector2) => void
    }): this {
        new WindowEventListener(
            'mousemove',
            ev => {
                let mouse = new Vector2().copy(ev)

                if (before) {
                    mouse = before(mouse) ?? new Vector2()
                }

                this.emitReversed('onGlobalMouseMove', {
                    x: mouse.x,
                    y: mouse.y,
                })
                after && after(mouse)
            },
            this
        )
        new WindowEventListener(
            'mousedown',
            ev => {
                if (ev.button === 0) {
                    this.isLeftMousePressed = true
                } else if (ev.button === 1) {
                    this.isMiddleMousePressed = true
                } else if (ev.button === 2) {
                    this.isRightMousePressed = true
                }

                let mouse = new Vector2().copy(ev)

                if (before) {
                    mouse = before(mouse) ?? new Vector2()
                }

                this.emitReversed('onGlobalMouseDown', {
                    x: mouse.x,
                    y: mouse.y,
                    button: ev.button,
                })
                after && after(mouse)
            },
            this
        )
        new WindowEventListener(
            'mouseup',
            ev => {
                if (ev.button === 0) {
                    this.isLeftMousePressed = false
                } else if (ev.button === 1) {
                    this.isMiddleMousePressed = false
                } else if (ev.button === 2) {
                    this.isRightMousePressed = false
                }

                let mouse = new Vector2().copy(ev)

                if (before) {
                    mouse = before(mouse) ?? new Vector2()
                }

                this.emitReversed('onGlobalMouseUp', {
                    x: mouse.x,
                    y: mouse.y,
                })
                after && after(mouse)
            },
            this
        )
        new WindowEventListener(
            'click',
            ev => {
                let mouse = new Vector2().copy(ev)

                if (before) {
                    mouse = before(mouse) ?? new Vector2()
                }

                this.emitReversed('globalClick', { x: mouse.x, y: mouse.y })
                after && after(mouse)
            },
            this
        )
        new WindowEventListener(
            'wheel',
            ev => {
                this.emitReversed('onGlobalScroll', {
                    x: ev.deltaX,
                    y: ev.deltaY,
                    z: ev.deltaZ,
                })
            },
            this
        )
        return this
    }

    /**
     * Registers keyboard event handlers for global keyboard interactions.
     * Handles keydown, keyup, and keypress events.
     * @param before Optional callback to run before keyboard events
     * @param after Optional callback to run after keyboard events
     * @returns This EffectThree instance for method chaining
     */
    registerEmitKeyboardEvents(before?: () => void, after?: () => void): this {
        new WindowEventListener(
            'keydown',
            ev => {
                this.isPressed[ev.code] = true
                if (before) before()
                this.emit('onGlobalKeyDown', { code: ev.code })
                if (after) after()
            },
            this
        )
        new WindowEventListener(
            'keyup',
            ev => {
                delete this.isPressed[ev.code]
                if (before) before()
                this.emit('onGlobalKeyUp', { code: ev.code })
                if (after) after()
            },
            this
        )
        new WindowEventListener(
            'keypress',
            ev => {
                if (before) before()
                this.emit('onGlobalKeyPress', { code: ev.code })
                if (after) after()
            },
            this
        )
        return this
    }

    /**
     * Registers render event handlers that run on every animation frame.
     * Emits beforeRender, render, and afterRender events.
     * @param options Configuration object
     * @param options.before Optional callback to run before render events
     * @param options.after Optional callback to run after render events
     * @returns This EffectThree instance for method chaining
     */
    registerRenderEvents({ before, after }: { before?: () => Vector2; after?: () => void }): this {
        new AnimationFrames(() => {
            before && before()
            this.emit('beforeRender', {})
            this.emit('render', {})
            this.emit('afterRender', {})
            after && after()
        }, this)
        return this
    }

    /**
     * Registers window resize event handlers.
     * Calls the resize callback immediately with current window dimensions.
     * @param options Configuration object
     * @param options.resize Callback to handle window resize events
     * @returns This EffectThree instance for method chaining
     */
    registerEmitWindowResize({ resize }: { resize: (w: number, h: number) => void }): this {
        resize(window.innerWidth, window.innerHeight)

        // TODO

        // const test = (
        //     <windowEventListener
        //         parent={this}
        //         event="resize"
        //         handler={() => {
        //             resize(window.innerWidth, window.innerHeight)
        //         }}
        //     />
        // )

        new WindowEventListener(
            'resize',
            () => {
                resize(window.innerWidth, window.innerHeight)
            },
            this
        )
        return this
    }

    /**
     * Registers gamepad event handlers for gamepad input.
     * Polls gamepad state on every animation frame and emits events for:
     * - Gamepad connection/disconnection
     * - Button press/release
     * - Axis movement (including stick positions)
     * @param options Configuration object
     * @param options.before Optional callback to run before gamepad polling
     * @param options.after Optional callback to run after gamepad polling
     * @returns This EffectThree instance for method chaining
     */
    registerGamepadEvents({
        before,
        after,
    }: {
        before?: () => void
        after?: () => void
    } = {}): this {
        if (runsOnServerSide) {
            return this
        }

        // Check for gamepad connection
        new WindowEventListener(
            'gamepadconnected',
            (ev: GamepadEvent) => {
                this.gamepadStates[ev.gamepad.index] = ev.gamepad
                this.emit('onGamepadConnected', { gamepad: ev.gamepad })
            },
            this
        )

        // Check for gamepad disconnection
        new WindowEventListener(
            'gamepaddisconnected',
            (ev: GamepadEvent) => {
                delete this.gamepadStates[ev.gamepad.index]
                this.emit('onGamepadDisconnected', { gamepad: ev.gamepad })
            },
            this
        )

        // Poll gamepad state on animation frame
        const pollGamepads = (): void => {
            if (before) {
                before()
            }

            const gamepads = navigator.getGamepads()

            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i]

                if (gamepad) {
                    this.gamepadStates[gamepad.index] = gamepad

                    // Check button states
                    gamepad.buttons.forEach((button, buttonIndex) => {
                        const buttonKey = `gamepad-${gamepad.index}-button-${buttonIndex}`
                        const wasPressed = this.gamepadButtonPressed[buttonKey]
                        const isPressed = button.pressed

                        if (isPressed && !wasPressed) {
                            this.gamepadButtonPressed[buttonKey] = true
                            this.emit('onGamepadButtonDown', {
                                gamepadIndex: gamepad.index,
                                buttonIndex,
                                value: button.value,
                            })
                        } else if (!isPressed && wasPressed) {
                            this.gamepadButtonPressed[buttonKey] = false
                            this.emit('onGamepadButtonUp', {
                                gamepadIndex: gamepad.index,
                                buttonIndex,
                                value: button.value,
                            })
                        }
                    })

                    // Check axis states
                    this.emit('onGamepadAxisMove', {
                        gamepadIndex: gamepad.index,
                        axes: gamepad.axes,
                        leftStick: {
                            x: gamepad.axes[0] || 0,
                            y: gamepad.axes[1] || 0,
                        },
                        rightStick: {
                            x: gamepad.axes[2] || 0,
                            y: gamepad.axes[3] || 0,
                        },
                    })
                }
            }

            if (after) {
                after()
            }

            requestAnimationFrame(pollGamepads)
        }

        // Start polling
        requestAnimationFrame(pollGamepads)

        return this
    }
}

// declare global {
//     namespace JSX {
//         interface IntrinsicElements {
//             windowEventListener: {
//                 parent: EffectDep
//                 event: keyof WindowEventMap
//                 handler: Function
//             }
//         }
//     }
// }
