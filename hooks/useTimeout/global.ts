import globalify from 'helpers/globalify'
import { DependencyList } from 'react'

import * as module from '.'

globalify({ useTimeout: module.default })

declare global {
    function useTimeout(callback: Function, interval: number, deps?: DependencyList): void
}
