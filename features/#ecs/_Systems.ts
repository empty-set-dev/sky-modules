import globalify from 'sky/utilities/globalify'

declare global {
    interface SystemConstructor {
        new (...args: unknown[]): System
        Entities: Record<string, { new (...args: unknown[]): Component }[]>
    }

    interface System {}

    class Systems extends lib.Systems {
        static context: boolean

        constructor(root: EffectsRoot, systems: System[])
        run(): void
    }
}

namespace lib {
    export class Systems {
        static context = true

        constructor(root: EffectsRoot, systems: System[]) {
            root.addContext(this)

            this.__systems = systems
            this.__systemsMap = {}

            systems.forEach(system => {
                const { Entities } = system.constructor as SystemConstructor
                Object.keys(Entities).forEach(k => {
                    Entities[k].forEach(Component => {
                        this.__systemsMap[Component.name] ??= []
                        if (!this.__systemsMap[Component.name].includes(system)) {
                            this.__systemsMap[Component.name].push(system)
                        }
                    })
                })
            })
        }

        run(): void {
            this.__timer ??= new Timer('[Systems].run')
            const dt = this.__timer.time().valueOf()
            this.__systems.forEach(system => {
                const systemWithRun = system as { run?: (dt: number) => void }
                systemWithRun.run && systemWithRun.run(dt)
            })
        }

        private __systems: System[]
        private __systemsMap: Record<string, System[]>
        private __timer!: Timer
    }
}

globalify(lib)
