import globalify from 'sky/helpers/globalify'

declare global {
    function sync(target: unknown, propertyKey: PropertyKey): void

    class Sync extends Root {}
}

namespace module {
    export function sync(target: unknown, propertyKey: PropertyKey): void {
        //
    }

    export class Sync extends Root {
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
}

globalify(module)
