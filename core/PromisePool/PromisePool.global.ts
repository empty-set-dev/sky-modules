import globalify from '@sky-modules/core/globalify'
import PromisePool, * as imports from './PromisePool'

declare global {
    type PromisePool = typeof imports.default
    const PromisePool: typeof imports.default
    const Task: typeof imports.Task
}

globalify({ PromisePool, ...imports })
