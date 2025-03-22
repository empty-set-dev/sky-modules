import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ useAnimationFrames: pkg.default })

declare global {
    function useAnimationFrames(callback: () => void, deps?: DependencyList): void
}
