import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ useInterval: pkg.default })

declare global {
    function useInterval(callback: Function, interval: Time, deps?: DependencyList): void
}
