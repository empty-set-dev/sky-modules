import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as module from '.'

globalify({ useTimeout: module.default })

declare global {
    function useTimeout(callback: Function, interval: number, deps?: DependencyList): void
}
