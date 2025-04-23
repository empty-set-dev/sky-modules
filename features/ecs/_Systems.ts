import globalify from 'sky/utilities/globalify'

import { __systems } from './__systems'

declare global {
    class Systems extends lib.Systems {}
}

namespace lib {
    export class Systems {
        static context = true

        readonly effect: Effect

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps)

            this.__systemsMap = {}

            Object.keys(__systems).forEach(systemName => {
                const system = new __systems[systemName]()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(this as any)[systemName] = system
                const { components } = system.constructor as never as { components: string[] }
                components.forEach(componentName => {
                    this.__systemsMap[componentName] ??= []
                    if (!this.__systemsMap[componentName].includes(system)) {
                        this.__systemsMap[componentName].push(system)
                    }
                })
            })
        }

        run(): void {
            this.__timer ??= new Timer('[Systems].run')
            const dt = this.__timer.time().valueOf()
            Object.keys(__systems).forEach(systemName => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const system = (this as any)[systemName] as System
                const systemWithRun = system as { run?: (dt: number) => void }
                systemWithRun.run && systemWithRun.run(dt)
            })
        }

        private __systemsMap: Record<string, System[]>
        private __timer!: Timer
    }
}

globalify(lib)
