import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ useTimeout: lib.default })

declare global {
    function useTimeout(callback: Function, interval: number, deps?: DependencyList): void
}
