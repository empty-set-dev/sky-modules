import globalify from 'sky/utilities/globalify'

import __signalOnDestroy from './__signalDestroyed'

declare global {
    class EffectsRoot extends lib.EffectsRoot {
        static groups: string[]

        get isDestroyed(): boolean

        get destroy(): () => Promise<void>
        set destroy(destroy: () => void | Promise<void>)
        addContext<T extends { constructor: Function }>(context: T): this
        removeContext<T extends { constructor: Function }>(context: T): this
        hasContext<T extends Context<T>>(Context: T): boolean
        context<T extends Context<T>>(Context: T): InstanceType<T>
        emit(
            eventName: string,
            event: unknown,
            group?: null | string,
            globalFields?: string[]
        ): this
        emitReversed(
            eventName: string,
            event: unknown,
            group?: null | string,
            globalFields?: string[]
        ): this
    }
}

async function __destroy(this: EffectsRoot): Promise<void> {
    __signalOnDestroy(this)
    return await this['__destroy']()
}

let __uniqueId = 1

namespace lib {
    export class EffectsRoot {
        static groups: string[]

        readonly id: number

        constructor() {
            this.id = __uniqueId
            ++__uniqueId

            const Context = this.constructor as Context

            if (Context.context) {
                this.__contexts = {
                    [Context.name]: this,
                }
            }

            const constructorAsGroups = this.constructor as never as {
                groups: string[]
                __groupsIndexes: Record<string, number>
            }

            if (constructorAsGroups.groups) {
                constructorAsGroups.__groupsIndexes = {}
                constructorAsGroups.groups.forEach((group, i) => {
                    constructorAsGroups.__groupsIndexes[group] = i
                })
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
            this.__contexts ??= {}
            const Context = context.constructor as Context

            if (!Context.context) {
                throw Error('class missing context property')
            }

            this.__contexts[Context.name] = context

            this.__groups &&
                this.__groups.forEach(group =>
                    group.forEach(link => {
                        link['__addContexts']({
                            [Context.name]: context,
                        })
                    })
                )

            return this
        }

        removeContext<T extends { constructor: Function }>(context: T): this {
            this.__contexts ??= {}
            const Context = context.constructor as Context

            if (!Context.context) {
                throw Error('class missing context property')
            }

            delete this.__contexts[Context.name]

            this.__groups &&
                this.__groups.forEach(group =>
                    group.forEach(link => {
                        link['__removeContexts']({ [Context.name]: context })
                    })
                )

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
            group?: string,
            globalFields?: string[]
        ): this {
            const localEvent = Object.assign({}, event)

            const thisAsEventEmitterAndActionsHooks = this as never as {
                [x: Object.Index]: Function
            } & {
                __hooks: Record<Object.Index, Function>
            }

            if (
                thisAsEventEmitterAndActionsHooks.__hooks &&
                thisAsEventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                thisAsEventEmitterAndActionsHooks.__hooks[eventName].call(this, localEvent)
            }

            if (thisAsEventEmitterAndActionsHooks[eventName]) {
                thisAsEventEmitterAndActionsHooks[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            if (!this.__groups) {
                return this
            }

            if (group) {
                const constructorAsGroups = this.constructor as never as { groups: string[] }
                const index = constructorAsGroups.groups.indexOf(group)

                if (index !== -1) {
                    this.__groups[index].forEach(link =>
                        link.emit(eventName, localEvent, group, globalFields)
                    )
                }
            } else {
                this.__groups.forEach(group =>
                    group.forEach(link => link.emit(eventName, localEvent, null, globalFields))
                )
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            return this
        }

        emitReversed<T extends { isCaptured?: boolean }>(
            eventName: string,
            event: T,
            group?: string,
            globalFields?: string[]
        ): this {
            const localEvent = Object.assign({}, event)

            const thisAsEventEmitterAndActionsHooks = this as never as {
                [x: Object.Index]: Function
            } & {
                __hooks: Record<Object.Index, Function>
            }

            if (
                thisAsEventEmitterAndActionsHooks.__hooks &&
                thisAsEventEmitterAndActionsHooks.__hooks[eventName]
            ) {
                thisAsEventEmitterAndActionsHooks.__hooks[eventName].call(this, localEvent)
            }

            if (thisAsEventEmitterAndActionsHooks[eventName]) {
                thisAsEventEmitterAndActionsHooks[eventName](localEvent)
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            if (!this.__groups) {
                if (localEvent.isCaptured) {
                    event.isCaptured = true
                }

                globalFields?.forEach(globalField => {
                    event[globalField as never] = localEvent[globalField as never]
                })

                return this
            }

            if (group) {
                const constructorAsGroups = this.constructor as never as { groups: string[] }
                const index = constructorAsGroups.groups.indexOf(group)

                if (index !== -1) {
                    for (let i = this.__groups[index].length - 1; i >= 0; --i) {
                        this.__groups[index][i].emitReversed(
                            eventName,
                            localEvent,
                            group,
                            globalFields
                        )
                    }
                }
            } else {
                for (let i = 0; i < this.__groups.length; ++i) {
                    const group = this.__groups[i]
                    for (let j = group.length - 1; j >= 0; --j) {
                        group[j].emitReversed(eventName, localEvent, null, globalFields)
                    }
                }
            }

            if (localEvent.isCaptured) {
                event.isCaptured = true
            }

            globalFields?.forEach(globalField => {
                event[globalField as never] = localEvent[globalField as never]
            })

            return this
        }

        registerEmitUpdate(before?: null | (() => void), after?: null | (() => void)): this {
            this.__timer = new Timer()

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

            return this
        }

        registerEmitMouseEvents(before?: (mouse: Vector2) => Vector2, after?: () => void): this {
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

                    after && after()
                },
                [this]
            )

            new WindowEventListener(
                'mousedown',
                ev => {
                    let mouse = new Vector2().copy(ev)

                    if (before) {
                        mouse = before(mouse)
                    }

                    this.emitReversed('onGlobalMouseDown', {
                        x: mouse.x,
                        y: mouse.y,
                        isCaptured: false,
                    })

                    after && after()
                },
                [this]
            )

            new WindowEventListener(
                'mouseup',
                ev => {
                    let mouse = new Vector2().copy(ev)

                    if (before) {
                        mouse = before(mouse)
                    }

                    this.emitReversed('onGlobalMouseUp', {
                        x: mouse.x,
                        y: mouse.y,
                        isCaptured: false,
                    })

                    after && after()
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

                    this.emit('globalClick', { x: mouse.x, y: mouse.y, isCaptured: false })
                    after && after()
                },
                [this]
            )

            new WindowEventListener(
                'wheel',
                ev => {
                    this.emit('onGlobalScroll', {
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
                    before && before()
                    this.emit('onGlobalKeyDown', { code: ev.code, isCaptured: false })
                    after && after()
                },
                [this]
            )
            new WindowEventListener(
                'keyup',
                ev => {
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

        private async __destroy(): Promise<void> {
            if (this.__groups) {
                this.__groups &&
                    (await Promise.all(
                        this.__groups.map(group =>
                            Promise.all(
                                group.map(link =>
                                    (async (): Promise<void> => {
                                        link['__parents'].remove(this)

                                        if (link['__parents'].length > 0) {
                                            if (this.__contexts) {
                                                link['__removeContexts'](this.__contexts)
                                            }
                                        } else {
                                            await link.destroy()
                                        }
                                    })()
                                )
                            )
                        )
                    ))
            }

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
        private __groups: undefined | Effect[][]
        private __timer: undefined | Timer
    }
}

globalify(lib)
