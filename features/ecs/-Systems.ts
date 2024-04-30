import { __SYSTEMS, __SYSTEMS_RECORD, __TIMER } from './__'

export {}

declare global {
    class Systems {
        constructor(systems?: { run: (dt: number) => void }[])
        run(): void
    }
}

class Systems {
    constructor(systems?: { run: (dt: number) => void }[]) {
        if (systems) {
            this[__SYSTEMS_RECORD] = {}
            this[__SYSTEMS] = systems
        }

        systems &&
            systems.forEach(system => {
                const { Components } = system.constructor as never as { Components }
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
        this[__SYSTEMS].forEach(system => system.run(this[__TIMER].time().valueOf()))
    }

    private [__SYSTEMS_RECORD]: Record<string, {}[]>
    private [__SYSTEMS]: { run(dt: number) }[]

    private [__TIMER]: Timer
}

globalify({ Systems })
