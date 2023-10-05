import globalify from 'utilities/globalify'

import * as module from './function-contexts/lib'
globalify(module)

declare global {
    const createFunctionContext: typeof module.createFunctionContext
    const getFunctionContext: typeof module.getFunctionContext
}
