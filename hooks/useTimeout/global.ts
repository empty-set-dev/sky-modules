import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ useTimeout: pkg.default })

declare global {
    function useTimeout(callback: Function, interval: Time, deps?: DependencyList): void
}
