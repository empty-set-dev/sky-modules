import globalify from 'sky/standard/globalify'

declare global {
    abstract class System extends lib.System {}
    function defineSystem(systemName: string, Class: Class): void
}

namespace lib {
    // TODO system hooks, affects
    export abstract class System {
        entities: Entity[] = []

        run(dt: number): void {
            dt
            return null!
        }
    }
}

globalify(lib)
