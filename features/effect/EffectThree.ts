/// jsx

import { assertIsNotUndefined } from '@sky-modules/core'
import Vector2 from '@sky-modules/math/Vector2'
import { runsOnServerSide } from '@sky-modules/platform/runsOnSide'

import ContextConstructor from './ContextConstructor'
import { Effect } from './Effect'
import internal from './internal'
import BaseOfEffect from './internal/BaseOfEffect'

export class EffectThree extends internal.BaseOfEffect {
    isLeftMousePressed: boolean = false
    isMiddleMousePressed: boolean = false
    isRightMousePressed: boolean = false
    isPressed: Record<string, boolean> = {}
    isPointerEventCaptured = false

    get isEffectThree(): boolean {
        return true
    }

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

    //     registerEmitUpdate(before?: null | (() => void), after?: null | (() => void)): this {
    //         this.__timer.reset()
    //         if (runsOnServerSide) {
    //             new Loop(
    //                 (1 / 50).seconds,
    //                 () => {
    //                     const dt = this.__timer.deltaTime()
    //                     before && before()
    //                     this.emit('beforeUpdate', { dt, isCaptured: false })
    //                     this.emit('update', { dt, isCaptured: false })
    //                     this.emit('afterUpdate', { dt, isCaptured: false })
    //                     after && after()
    //                 },
    //                 this
    //             )
    //         } else {
    //             new AnimationFrames(() => {
    //                 const dt = this.__timer.deltaTime()
    //                 before && before()
    //                 this.emit('beforeUpdate', { dt, isCaptured: false })
    //                 this.emit('update', { dt, isCaptured: false })
    //                 this.emit('afterUpdate', { dt, isCaptured: false })
    //                 this.emit('beforeAnimationFrame', { dt, isCaptured: false })
    //                 this.emit('onAnimationFrame', { dt, isCaptured: false })
    //                 this.emit('afterAnimationFrame', { dt, isCaptured: false })
    //                 after && after()
    //                 this.isPointerEventCaptured = false
    //             }, this)
    //         }
    //         return this
    //     }
    //     registerEmitMouseEvents(
    //         before?: (mouse: Vector2) => Vector2,
    //         after?: (mouse: Vector2) => void
    //     ): this {
    //         new WindowEventListener(
    //             'mousemove',
    //             ev => {
    //                 let mouse = new Vector2().copy(ev)
    //                 if (before) {
    //                     mouse = before(mouse)
    //                 }
    //                 this.emitReversed('onGlobalMouseMove', {
    //                     x: mouse.x,
    //                     y: mouse.y,
    //                     isCaptured: this.isPointerEventCaptured,
    //                 })
    //                 after && after(mouse)
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'mousedown',
    //             ev => {
    //                 if (ev.button === 0) {
    //                     this.isLeftMousePressed = true
    //                 } else if (ev.button === 1) {
    //                     this.isMiddleMousePressed = true
    //                 } else if (ev.button === 2) {
    //                     this.isRightMousePressed = true
    //                 }
    //                 let mouse = new Vector2().copy(ev)
    //                 if (before) {
    //                     mouse = before(mouse)
    //                 }
    //                 this.emitReversed('onGlobalMouseDown', {
    //                     x: mouse.x,
    //                     y: mouse.y,
    //                     button: ev.button,
    //                     isCaptured: this.isPointerEventCaptured,
    //                 })
    //                 after && after(mouse)
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'mouseup',
    //             ev => {
    //                 if (ev.button === 0) {
    //                     this.isLeftMousePressed = false
    //                 } else if (ev.button === 1) {
    //                     this.isMiddleMousePressed = false
    //                 } else if (ev.button === 2) {
    //                     this.isRightMousePressed = false
    //                 }
    //                 let mouse = new Vector2().copy(ev)
    //                 if (before) {
    //                     mouse = before(mouse)
    //                 }
    //                 this.emitReversed('onGlobalMouseUp', {
    //                     x: mouse.x,
    //                     y: mouse.y,
    //                     isCaptured: this.isPointerEventCaptured,
    //                 })
    //                 after && after(mouse)
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'click',
    //             ev => {
    //                 let mouse = new Vector2().copy(ev)
    //                 if (before) {
    //                     mouse = before(mouse)
    //                 }
    //                 this.emitReversed('globalClick', { x: mouse.x, y: mouse.y, isCaptured: false })
    //                 after && after(mouse)
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'wheel',
    //             ev => {
    //                 this.emitReversed('onGlobalScroll', {
    //                     x: ev.deltaX,
    //                     y: ev.deltaY,
    //                     z: ev.deltaZ,
    //                     isCaptured: this.isPointerEventCaptured,
    //                 })
    //             },
    //             [this]
    //         )
    //         return this
    //     }
    //     registerEmitKeyboardEvents(before?: () => void, after?: () => void): this {
    //         new WindowEventListener(
    //             'keydown',
    //             ev => {
    //                 this.isPressed[ev.code] = true
    //                 before && before()
    //                 this.emit('onGlobalKeyDown', { code: ev.code, isCaptured: false })
    //                 after && after()
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'keyup',
    //             ev => {
    //                 delete this.isPressed[ev.code]
    //                 before && before()
    //                 this.emit('onGlobalKeyUp', { code: ev.code, isCaptured: false })
    //                 after && after()
    //             },
    //             [this]
    //         )
    //         new WindowEventListener(
    //             'keypress',
    //             ev => {
    //                 before && before()
    //                 this.emit('onGlobalKeyPress', { code: ev.code, isCaptured: false })
    //                 after && after()
    //             },
    //             [this]
    //         )
    //         return this
    //     }
    //     registerEmitRender(before?: () => Vector2, after?: () => void): this {
    //         new AnimationFrames(() => {
    //             before && before()
    //             this.emit('beforeRender', {
    //                 isCaptured: false,
    //             })
    //             this.emit('render', {
    //                 isCaptured: false,
    //             })
    //             this.emit('afterRender', {
    //                 isCaptured: false,
    //             })
    //             after && after()
    //         }, this)
    //         return this
    //     }
    //     registerEmitDraw(
    //         before?: (position: Vector2) => undefined | Vector2,
    //         after?: (position: Vector2) => void
    //     ): this {
    //         new AnimationFrames(() => {
    //             let position = new Vector2()
    //             if (before) {
    //                 position = before(position) ?? new Vector2()
    //             }
    //             this.emit('beforeDraw', {
    //                 x: position.x,
    //                 y: position.y,
    //                 opacity: 1,
    //                 visible: true,
    //                 isCaptured: false,
    //             })
    //             this.emit('draw', {
    //                 x: position.x,
    //                 y: position.y,
    //                 opacity: 1,
    //                 visible: true,
    //                 isCaptured: false,
    //             })
    //             this.emit('afterDraw', {
    //                 x: position.x,
    //                 y: position.y,
    //                 opacity: 1,
    //                 visible: true,
    //                 isCaptured: false,
    //             })
    //             after && after(position)
    //         }, this)
    //         return this
    //     }
    //     registerEmitWindowResize(resize: (w: number, h: number) => void): this {
    //         resize(window.innerWidth, window.innerHeight)
    //         new WindowEventListener(
    //             'resize',
    //             () => {
    //                 resize(window.innerWidth, window.innerHeight)
    //             },
    //             this
    //         )
    //         return this
    //     }
}
