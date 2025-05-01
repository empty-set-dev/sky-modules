import Vector2 from 'sky/math/Vector2'
import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'
import globalify from 'sky/utilities/globalify'

import __signalOnDestroy from './__signalDestroyed'

declare global {
    class EffectsRoot extends lib.EffectsRoot {
        constructor(main?: { root: EffectsRoot } | { effect: Effect })

        get isDestroyed(): boolean

        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        addContext<T extends { constructor: Function }>(context: T): this
        removeContext<T extends { constructor: Function }>(context: T): this
        hasContext<T extends Context<T>>(Context: T): boolean
        context<T extends Context<T>>(Context: T): InstanceType<T>
        emit(eventName: string, event: unknown, globalFields?: string[]): this
        emitReversed(eventName: string, event: unknown, globalFields?: string[]): this
    }
}

async function __destroy(this: EffectsRoot): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

let __uniqueId = 1

namespace lib {
    export class EffectsRoot {
        readonly main: { root: EffectsRoot } | { effect: Effect }
        readonly id: number
        isLeftMousePressed: boolean = false
        isMiddleMousePressed: boolean = false
        isRightMousePressed: boolean = false
        isPressed: Record<string, boolean> = {}

        constructor(main: { root: EffectsRoot } | { effect: Effect }) {
            this.main = main

            this.id = __uniqueId
            ++__uniqueId

            const Context = this.constructor as Context

            if (Context.context) {
                this.__contexts = {
                    [Context.name]: this,
                }
            }
        }

        get isDestroyed(): boolean {
            return this.__isDestroyed !== undefined
        }

        get destroy(): () => Promise<void> {
            return __destroy
        }

        set destroy(destroy: () => void | Promise<void>) {
            const originalDestroy = this.__destroy
            this.__destroy = async (): Promise<void> => {
                if (this.isDestroyed) {
                    return
                }

                await destroy.call(this)
                await originalDestroy.call(this)
            }
        }

        addContext<T extends { constructor: Function }>(context: T): this {
            const Context = context.constructor as Context

            if (!Context.context) {
                throw Error('class missing context property')
            }

            this.__contexts ??= {}

            this.__contexts[Context.name] = context

            this.__children &&
                this.__children.forEach(child => {
                    child['__addContexts']({
                        [Context.name]: context,
                    })
                })

            return this
        }

        removeContext<T extends { constructor: Function }>(context: T): this {
            this.__contexts ??= {}
            const Context = context.constructor as Context

            if (!Context.context) {
                throw Error('class missing context property')
            }

            delete this.__contexts[Context.name]

            this.__children &&
                this.__children.forEach(child => {
                    child['__removeContexts']({ [Context.name]: context })
                })

            return this
        }

        hasContext<T extends Context<T>>(Context: T): boolean {
            if (!this.__contexts || !this.__contexts[Context.name]) {
                return false
            }

            return true
        }

        context<T extends Context<T>>(Context: T): InstanceType<T> {
            if (!this.__contexts || !this.__contexts[Context.name]) {
                throw new Error('context missing')
            }

            return this.__contexts[Context.name] as InstanceType<T>
        }

        emit<T extends { isCaptured?: boolean }>(
            eventName: string,
            event: T,
            globalFields?: string[]
        ): this {
            const localEvent = Object.assign({}, event)

            let eventEmitterAndActionsHooks: {
                [x: Object.Index]: Function
            } & {
                __hooks: Record<Object.Index, Function>
            }

            const emitEvent = (): void => {
                if (eventEmitterAndActionsHooks[eventName]) {
                    eventEmitterAndActionsHooks[eventName](localEvent)
                }

                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })

                if (!this.__children) {
                    return
                }

                this.__children.forEach(child => child.emit(eventName, localEvent, globalFields))

                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })
            }

            if (this.main) {
                eventEmitterAndActionsHooks = this.main as never
            } else {
                eventEmitterAndActionsHooks = this as never
            }

            if (
                eventEmitterAndActionsHooks.__hooks &&
                eventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                eventEmitterAndActionsHooks.__hooks[eventName].call(
                    eventEmitterAndActionsHooks,
                    localEvent,
                    emitEvent
                )

                return this
            }

            emitEvent()

            return this
        }

        emitReversed<T extends { isCaptured?: boolean }>(
            eventName: string,
            event: T,
            globalFields?: string[]
        ): this {
            const localEvent = Object.assign({}, event)

            let eventEmitterAndActionsHooks: {
                [x: Object.Index]: Function
            } & {
                __hooks: Record<Object.Index, Function>
            }

            const emitEvent = (): void => {
                if (eventEmitterAndActionsHooks[eventName]) {
                    eventEmitterAndActionsHooks[eventName](localEvent)
                }

                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })

                if (!this.__children) {
                    if (localEvent.isCaptured) {
                        event.isCaptured = true
                    }

                    globalFields?.forEach(globalField => {
                        event[globalField as never] = localEvent[globalField as never]
                    })

                    return
                }

                for (let i = this.__children.length - 1; i >= 0; --i) {
                    this.__children[i].emitReversed(eventName, localEvent, globalFields)
                }

                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })
            }

            if (this.main) {
                eventEmitterAndActionsHooks = this.main as never
            } else {
                eventEmitterAndActionsHooks = this as never
            }

            if (
                eventEmitterAndActionsHooks.__hooks &&
                eventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                eventEmitterAndActionsHooks.__hooks[eventName].call(
                    eventEmitterAndActionsHooks,
                    localEvent,
                    emitEvent
                )

                return this
            }

            emitEvent()

            return this
        }

        registerEmitUpdate(before?: null | (() => void), after?: null | (() => void)): this {
            this.__timer = new Timer()

            if (runsOnServerSide) {
                new Loop(
                    Time(1 / 50, seconds),
                    () => {
                        const dt = this.__timer!.time().seconds

                        before && before()
                        this.emit('beforeUpdate', { dt, isCaptured: false })
                        this.emit('update', { dt, isCaptured: false })
                        this.emit('afterUpdate', { dt, isCaptured: false })
                        after && after()
                    },
                    this
                )
            } else {
                new AnimationFrames(() => {
                    const dt = this.__timer!.time().seconds

                    before && before()
                    this.emit('beforeUpdate', { dt, isCaptured: false })
                    this.emit('update', { dt, isCaptured: false })
                    this.emit('afterUpdate', { dt, isCaptured: false })
                    this.emit('beforeAnimationFrame', { dt, isCaptured: false })
                    this.emit('onAnimationFrame', { dt, isCaptured: false })
                    this.emit('afterAnimationFrame', { dt, isCaptured: false })
                    after && after()
                }, this)
            }

            return this
        }

        registerEmitMouseEvents(
            before?: (mouse: Vector2) => Vector2,
            after?: (mouse: Vector2) => void
        ): this {
            new WindowEventListener(
                'mousemove',
                ev => {
                    let mouse = new Vector2().copy(ev)

                    if (before) {
                        mouse = before(mouse)
                    }

                    this.emitReversed('onGlobalMouseMove', {
                        x: mouse.x,
                        y: mouse.y,
                        isCaptured: false,
                    })

                    after && after(mouse)
                },
                [this]
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
                        mouse = before(mouse)
                    }

                    this.emitReversed('onGlobalMouseDown', {
                        x: mouse.x,
                        y: mouse.y,
                        button: ev.button,
                        isCaptured: false,
                    })

                    after && after(mouse)
                },
                [this]
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
                        mouse = before(mouse)
                    }

                    this.emitReversed('onGlobalMouseUp', {
                        x: mouse.x,
                        y: mouse.y,
                        isCaptured: false,
                    })

                    after && after(mouse)
                },
                [this]
            )

            new WindowEventListener(
                'click',
                ev => {
                    let mouse = new Vector2().copy(ev)

                    if (before) {
                        mouse = before(mouse)
                    }

                    this.emitReversed('globalClick', { x: mouse.x, y: mouse.y, isCaptured: false })
                    after && after(mouse)
                },
                [this]
            )

            new WindowEventListener(
                'wheel',
                ev => {
                    this.emitReversed('onGlobalScroll', {
                        x: ev.deltaX,
                        y: ev.deltaY,
                        z: ev.deltaZ,
                        isCaptured: false,
                    })
                },
                [this]
            )

            return this
        }

        registerEmitKeyboardEvents(before?: () => void, after?: () => void): this {
            new WindowEventListener(
                'keydown',
                ev => {
                    this.isPressed[ev.code] = true
                    before && before()
                    this.emit('onGlobalKeyDown', { code: ev.code, isCaptured: false })
                    after && after()
                },
                [this]
            )
            new WindowEventListener(
                'keyup',
                ev => {
                    delete this.isPressed[ev.code]
                    before && before()
                    this.emit('onGlobalKeyUp', { code: ev.code, isCaptured: false })
                    after && after()
                },
                [this]
            )
            new WindowEventListener(
                'keypress',
                ev => {
                    before && before()
                    this.emit('onGlobalKeyPress', { code: ev.code, isCaptured: false })
                    after && after()
                },
                [this]
            )

            return this
        }

        registerEmitDraw(
            before?: (position: Vector2) => Vector2,
            after?: (position: Vector2) => void
        ): this {
            new AnimationFrames(() => {
                let position = new Vector2()

                if (before) {
                    position = before(position)
                }

                this.emit('beforeDraw', {
                    position,
                    isCaptured: false,
                })
                this.emit('draw', {
                    position,
                    isCaptured: false,
                })
                this.emit('afterDraw', {
                    position,
                    isCaptured: false,
                })
                after && after(position)
            }, this)

            return this
        }

        registerEmitWindowResize(resize: (w: number, h: number) => void): this {
            resize(window.innerWidth, window.innerHeight)

            new WindowEventListener(
                'resize',
                () => {
                    resize(window.innerWidth, window.innerHeight)
                },
                this
            )

            return this
        }

        private async __destroy(): Promise<void> {
            this.__children &&
                Promise.all(
                    this.__children.map(child =>
                        (async (): Promise<void> => {
                            child['__parents'].remove(this)

                            if (child['__parents'].length > 0) {
                                if (this.__contexts) {
                                    child['__removeContexts'](this.__contexts)
                                }
                            } else {
                                await child.destroy()
                            }
                        })()
                    )
                )

            this.__effects &&
                (await Promise.all(
                    this.__effects.map(effect => {
                        if (effect['__isDestroyed'] !== undefined) {
                            return
                        }

                        ;(async (): Promise<void> => {
                            await effect.destroy()
                        })()
                    })
                ))

            this.__isDestroyed = true
        }

        private __isDestroyed: undefined | boolean
        private __contexts: undefined | Record<string, unknown>
        private __effects: undefined | Effect[]
        private __children: undefined | Effect[]
        private __timer: undefined | Timer
    }
}

globalify(lib)
