import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ useTimeout: module.default })

declare global {
    function useTimeout(callback: Function, interval: Time, deps?: DependencyList): void
}
