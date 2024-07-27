import globalify from 'sky/helpers/globalify'

const registerSymbol = Symbol('register')

enum Events {
    CREATE,
    DESTROY,
    INIT_PROPERTY,
    DELETE_PRORERTY,
    ARRAY_CHANGE,
}

declare global {
    function sync(target: unknown): void
    function sync(target: unknown, propertyKey: PropertyKey): void

    class Sync extends Root {
        static context
    }

    function ClientSync<T>(target: T): T
}

namespace lib {
    export function sync(target: unknown, propertyKey: PropertyKey): void {
        target[registerSymbol] ??= {}
        target[registerSymbol][propertyKey] = true

        if (!target['onSyncContext']) {
            target['onSyncContext'] = function (sync: Sync): () => void {
                sync

                return (): void => {
                    //
                }
            }
        }
    }

    export class Sync extends Root {
        static context = 'SyncContext'

        update(data: unknown): void {}
        updates: (data: unknown) => void

        constructor() {
            super()

            const register = (this.constructor as unknown as { register: unknown }).register

            if (!register) {
                const list = (this.constructor as unknown as { list: unknown[] }).list

                list.forEach(class_ => {
                    // console.log(class_)
                })
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export function ClientSync<T>(target: T): T {
        return Object as unknown as T
    }
}

globalify(lib)
