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
        root.addContext(this)

        this.__systemsMap = {}
        this.__systems = systems

        systems &&
            systems.forEach(system => {
                const { Components } = system.constructor as SystemConstructor
                Components &&
                    Object.keys(Components).forEach(k => {
                        Components[k].forEach(Component => {
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
        this.__systems.forEach(system => system.run(dt))
    }

    private __systemsMap: Record<string, System[]>
    private __systems: { run(dt: number) }[]
    private __timer: Timer
}

globalify({ Systems })
