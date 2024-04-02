import { DependencyList } from 'react'
import globalify from 'utilities/globalify/globalify'

import * as module from './useInterval'

globalify({ useInterval: module.default })

declare global {
    function useInterval(callback: Function, interval: number, deps?: DependencyList): void
}
