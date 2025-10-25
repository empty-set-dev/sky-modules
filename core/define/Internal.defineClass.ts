import assume from '#/assume'
import { isHot } from '#/hmr'
import reactivePropertyDescriptors from '#/reactive/reactivePropertyDescriptors'

import { RuntimeDefineError } from './errors'
import Internal from './Internal'

export function defineClass<
    T extends {
        new (...args: unknown[]): {}
        prototype: { schema?: object }
    },
>(name: string, Target: T): void {
    if (isRuntime && !isHot()) {
        throw new RuntimeDefineError()
    }

    assume<Internal.Static>(Target)

    Target[Internal.typeSymbol] = 'class'
    Target[Internal.nameSymbol] = Target.name
    Target[Internal.uidSymbol] = name

    Internal.defines[name] = {
        name,
        value: Target,
    }

    // Apply reactive property descriptors only if class has a schema
    if (Target.prototype.schema != null) {
        const propertiesMap = reactivePropertyDescriptors(Target.prototype.schema)
        Object.defineProperties(Target.prototype, propertiesMap)
    }
}
