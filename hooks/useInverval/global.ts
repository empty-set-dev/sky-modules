import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as module from '.'

globalify({ useInterval: module.default })

declare global {
    function useInterval(callback: Function, interval: number, deps?: DependencyList): void
}
