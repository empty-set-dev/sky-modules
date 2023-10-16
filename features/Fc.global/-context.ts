import './-Fc'

import { FunctionContext, createFunctionContext, getFunctionContext } from './-function-contexts'

export {}

declare global {
    function context<C, P = {}>(
        component: (props: P) => ReactNode
    ): ((props: P) => ReactNode) & ReturnType<typeof Fc.createContext<C>>

    interface Fc {
        createContext<T>(): FunctionContext<T>
        context<T>(context: FunctionContext<T>): T
    }
}

Fc.createContext = function <T>(): FunctionContext<T> {
    return createFunctionContext()
}

Fc.context = function <T>(context: FunctionContext<T>): T {
    return getFunctionContext(context)
}

namespace module {
    export function context<C, P = void>(
        component: (props: P) => ReactNode
    ): ((props: P) => ReactNode) & ReturnType<typeof Fc.createContext<C>> {
        Object.setPrototypeOf(Object.getPrototypeOf(component), Fc.createContext<C>())
        return component as never
    }
}

Object.assign(global, module)
