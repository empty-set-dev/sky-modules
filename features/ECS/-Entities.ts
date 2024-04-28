import Link from './-Link'
import { __ON_END, __SYSTEMS } from './__'
import __signalOnDestroy from '../link/__signalOnDestroy'

export {}

declare global {
    class Entities<R = void, A extends unknown[] = []> extends Link<R, A> {
        constructor(systems?: {}[])

        get destroy(): (...args: A) => Promise<Awaited<R>>

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )

        run()
    }
}

async function destroy<R, A extends unknown[]>(
    this: Entity<R, A>,
    ...args: A
): Promise<Awaited<R>> {
    __signalOnDestroy.call(this)
    return this['resolve'](await this[__ON_END](...args))
}

namespace module {

    export class Entities<R = void, A extends unknown[] = []> extends Link<R, A> {
        constructor(systems?: { run: (dt: number) => void }[]) {
            super()

            if (systems) {
                this[__SYSTEMS] = {}
                this[__SYSTEMS_LIST] = systems
            }

            systems &&
                systems.forEach(system => {
                    const { Components } = system.constructor as never as { Components }
                    Components &&
                        Object.keys(Components).forEach(k => {
                            Components[k].forEach(Component => {
                                this[__SYSTEMS][Component.name] ??= []
                                if (!this[__SYSTEMS][Component.name].includes(system)) {
                                    this[__SYSTEMS][Component.name].push(system)
                                }
                            })
                        })
                })
        }

        run(): void {
            this[__TIMER] ??= new Timer('(Entities).run')
            this[__SYSTEMS_LIST].forEach(system => system.run(this[__TIMER].time().valueOf()))
        }

        get destroy(): (...args: A) => Promise<Awaited<R>> {
            return destroy
        }

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        ) {
            const originalDestroy = this[__ON_END]
            this[__ON_END] = (...args: A): Promise<Awaited<R>> => {
                return destroy(originalDestroy, ...args)
            }
        }

        private [__SYSTEMS]: Record<string, {}[]>
        private [__SYSTEMS_LIST]: { run(dt: number) }[]

        private [__TIMER]: Timer
    }
}

Object.assign(global, module)
