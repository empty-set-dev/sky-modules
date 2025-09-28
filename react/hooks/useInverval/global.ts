import { DependencyList } from 'react'
import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ useInterval: lib.default })

declare global {
    function useInterval(callback: Function, interval: Time, deps?: DependencyList): void
}
