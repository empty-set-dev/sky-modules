import globalify from 'sky/helpers/globalify'

const idSymbol = Symbol('id')
let uniqueId = 0

enum Events {
    CREATE,
    DESTROY,
    CHANGE,
}

declare global {
    function sync(target: unknown): void
    function sync(target: unknown, propertyKey: PropertyKey): void

    namespace Sync {
        type UpdateData =
            | [Events.CREATE, classId: number, id: number, Record<string, unknown>]
            | [Events.DESTROY, id: number]
            | [Events.CHANGE, id: number, Record<string, unknown>]
    }

    class Sync extends Root {
        static agent: 'SyncAgent'

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

                const classId = classMap.get(target)

                if (this[idSymbol] == null) {
                    this[idSymbol] = uniqueId
                    ++uniqueId
                }

                sync.update([Events.CREATE, classId, this[idSymbol], data])

                return () => {
                    sync.update([Events.DESTROY, this[idSymbol]])
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
