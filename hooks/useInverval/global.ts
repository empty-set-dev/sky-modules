import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ useInterval: pkg.default })

declare global {
    function useInterval(callback: Function, interval: number, deps?: DependencyList): void
}
