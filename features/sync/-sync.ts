import globalify from 'sky/helpers/globalify'

enum Events {
    CREATE,
    DESTROY,
    CHANGE,
}

declare global {
    function sync(target: unknown): void
    function sync(target: unknown, propertyKey: PropertyKey): void

    namespace Sync {
        type UpdateData = [Events, id: number, Record<string, unknown>?]
    }

    class Sync extends Root {
        static context

        constructor(update: (data: Sync.UpdateData) => void)
    }

    function ClientSync<T>(target: T): T
}

namespace lib {
    export function sync(target: unknown, propertyKey?: PropertyKey): void {
        if (!propertyKey) {
            target['prototype']['onSyncContext'] = function (sync: Sync): () => void {
                const syncConstructor = sync.constructor

                if (!syncConstructor['__classMap']) {
                    const classMap = (syncConstructor['__classMap'] = new Map())

                    syncConstructor['list'].forEach((class_, i) => {
                        classMap.set(class_, i)
                    })
                }

                const classMap = syncConstructor['__classMap']

                const data: Record<string, unknown> = {}
                target['__properties'].forEach(propertyKey => {
                    data[propertyKey] = this[propertyKey] ?? null
                })

                const id = classMap.get(target)

                sync.update([Events.CREATE, id, data])

                return () => {
                    sync.update([Events.DESTROY, id])
                }
            }
        }

        const constructor = target.constructor
        constructor['__properties'] ??= []
        constructor['__properties'].push(propertyKey)
    }

    export class Sync extends Root {
        static context = 'SyncContext'

        update: (data: Sync.UpdateData) => void

        constructor(update: (data: Sync.UpdateData) => void) {
            super()

            this.update = update
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export function ClientSync<T>(target: T): T {
        return Object as unknown as T
    }
}

globalify(lib)
