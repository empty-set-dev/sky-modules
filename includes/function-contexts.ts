import * as module from 'function-contexts'
import globalify from 'utilities/globalify'

globalify(module)

declare global {
    const createFunctionContext: typeof module.createFunctionContext
    const getFunctionContext: typeof module.getFunctionContext
}
