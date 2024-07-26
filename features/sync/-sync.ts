import globalify from 'sky/helpers/globalify'

const registerSymbol = Symbol('register')
const objectsSymbol = Symbol('objects')

declare global {
    function sync(target: unknown, propertyKey: PropertyKey): void

    class Sync extends Root {}

    function ClientSync<T>(target: T): T
}

namespace module {
    export function sync(target: unknown, propertyKey: PropertyKey): void {
        target[registerSymbol] ??= {}
        target[registerSymbol][propertyKey] = true
    }

    export class Sync extends Root {
        static context = 'Sync'

        update(data: unknown): void {}
        updates: (data: unknown) => void

        constructor() {
            super()

            const register = (this.constructor as unknown as { register: unknown }).register

            if (!register) {
                const list = (this.constructor as unknown as { list: unknown[] }).list

                list.forEach(class_ => {
                    console.log(class_)
                })
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export function ClientSync<T>(target: T): T {
        return Object as unknown as T
    }
}

globalify(module)
