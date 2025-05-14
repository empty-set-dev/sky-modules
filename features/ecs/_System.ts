import globalify from 'sky/utilities/globalify'

declare global {
    abstract class System extends module.System {}
    function defineSystem(systemName: string, Class: Class): void
}

namespace module {
    export abstract class System {
        entities: Entity[] = []

        run(dt: number): void {
            dt
            return null!
        }
    }
}

globalify(module)
