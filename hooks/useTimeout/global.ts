import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ useTimeout: pkg.default })

declare global {
    function useTimeout(callback: Function, interval: Time, deps?: DependencyList): void
}
