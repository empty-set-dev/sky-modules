import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ useInterval: module.default })

declare global {
    function useInterval(callback: Function, interval: Time, deps?: DependencyList): void
}
