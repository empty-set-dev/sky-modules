import { DependencyList } from 'react'
import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ useAnimationFrames: lib.default })

declare global {
    function useAnimationFrames(callback: () => void, deps?: DependencyList): void
}
