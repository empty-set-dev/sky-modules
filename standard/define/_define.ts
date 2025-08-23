import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    const define: typeof lib.define & { new (): void }
}

namespace lib {
    define('sky.standard.define', define)
    export function define(name: string, fn?: Function): (target: Class) => void {
        fn

        return function (target: Class): void {
            if (isRuntime) {
                throw Error('runtime define')
            }

            if (!extends_type<{ [k: symbol]: number | string }>(target)) {
                return null!
            }

            // console.log(name)

            // console.log(Object.getOwnPropertyDescriptors(target.prototype))

            const define = {
                name,
                value: target,
            }

            local.defines[name] = define as typeof define & (typeof local.defines)['']
        }
    }
}

globalify(lib)
