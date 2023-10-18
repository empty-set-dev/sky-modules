export {}

declare global {
    const every: (entity: Entity | Effect, time: time, callback: (dt: time) => void) => void
    const emitEvery: (entities: Entities, time: time, dt: number) => void
}

namespace module {
    export const every = (
        entity: Entity | Effect,
        time: time,
        callback: (dt: time) => void
    ): void => {
        on(entity, `Update(${time.seconds.toFixed(2)} s)`, callback)
    }

    export const emitEvery = (entities: Entities, time: time, dt: number): void => {
        entities.emit(`Update(${time.seconds.toFixed(2)} s)`, dt)
    }
}

Object.assign(global, module)
