export {}

declare global {
    interface on {}
    const on: ((
        entity: Entity | Effect,
        event: string,
        callback: (...args: unknown[]) => void
    ) => void) &
        on
}

namespace module {
    export const on = (entity: Entity | Effect, event: string, callback: Function): void => {
        const link = entity['link'] as never as { link; on }

        if (!link) {
            entity['__events'] ??= {}
            entity['__events'][event] ??= []
            entity['__events'][event].push(callback)
            return
        }

        link['___events'] ??= {}

        if (!link['___events'][event]) {
            const events = (link['___events'][event] = [])
            events.push(callback)

            if (link.on) {
                link.on(event, (...args) => events.forEach(onEvent => onEvent(...args)))
            }
        }
    }
}

Object.assign(global, module)
