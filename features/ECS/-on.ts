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
    export const on = (entity: Link, event: string, callback: Function): void => {
        const link = entity['link'] as never as { link; on }

        if (!link) {
            entity['__events'] ??= {}
            entity['__events'][event] ??= []
            entity['__events'][event].push(callback)
            return
        }

        link['___events'] ??= {}
        if (!link['___events'][event]) {
            link['___events'][event] = []
            if (link.on) {
                link.on(event, (...args) =>
                    link['___events'][event].forEach(onEvent => onEvent(...args))
                )
            }
        }

        link['___events'][event].push(callback)
    }
}

Object.assign(global, module)
