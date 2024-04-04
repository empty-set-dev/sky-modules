import { DependencyList } from 'react'
import globalify from 'helpers/globalify/-globalify'

import * as module from './useTimeout'

globalify({ useTimeout: module.default })

declare global {
    function useTimeout(callback: Function, interval: number, deps?: DependencyList): void
}
