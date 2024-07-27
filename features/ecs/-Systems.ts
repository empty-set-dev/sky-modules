import { __SYSTEMS, __SYSTEMS_RECORD, __TIMER } from './__'

export {}

declare global {
    interface SystemConstructor {
        new (...args: unknown[]): System
        Components: Record<string, { new (...args: unknown[]): Component }[]>
    }

    interface System {
        run: (dt: number) => void
    }

    class Systems {
        static context: string

        constructor(root: Root, systems: System[])
        run(): void
    }
}

class Systems {
    static context = 'SystemsContext'

    constructor(root: Root, systems: System[]) {
        root.addContext(Systems, this)

        this[__SYSTEMS_RECORD] = {}
        this[__SYSTEMS] = systems

        systems &&
            systems.forEach(system => {
                const { Components } = system.constructor as SystemConstructor
                Components &&
                    Object.keys(Components).forEach(k => {
                        Components[k].forEach(Component => {
                            this[__SYSTEMS_RECORD][Component.name] ??= []
                            if (!this[__SYSTEMS_RECORD][Component.name].includes(system)) {
                                this[__SYSTEMS_RECORD][Component.name].push(system)
                            }
                        })
                    })
            })
    }

    run(): void {
        this[__TIMER] ??= new Timer('(Entities).run')
        const dt = this[__TIMER].time().valueOf()
        this[__SYSTEMS].forEach(system => system.run(dt))
    }

    private [__SYSTEMS_RECORD]: Record<string, System[]>
    private [__SYSTEMS]: { run(dt: number) }[]

    private [__TIMER]: Timer
}

globalify({ Systems })
