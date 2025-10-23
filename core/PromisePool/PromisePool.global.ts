import globalify from '@sky-modules/core/globalify'
import PromisePool, * as imports from './PromisePool'

declare global {
    const PromisePool: typeof imports.default
    type Task = typeof imports.Task
}

globalify({ PromisePool, ...imports })
