import globalify from 'helpers/globalify'
import { DependencyList } from 'react'

import * as module from '.'

globalify({ useInterval: module.default })

declare global {
    function useInterval(callback: Function, interval: number, deps?: DependencyList): void
}
