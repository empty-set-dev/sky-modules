export {}

declare global {
    class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        constructor(link: Effects)
    }
}

namespace module {}
Object.assign(global, module)
