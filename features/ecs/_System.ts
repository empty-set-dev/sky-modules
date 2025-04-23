import globalify from 'sky/utilities/globalify'

declare global {
    abstract class System extends lib.System {}
    function defineSystem(systemName: string, Class: Class): void
}

namespace lib {
    export abstract class System {
        entities: Entity[] = []

        run(dt: number): void {
            dt
            return null!
        }
    }
}

globalify(lib)
