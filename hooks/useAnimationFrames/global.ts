import { DependencyList } from 'react'
import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ useAnimationFrames: pkg.default })

declare global {
    function useAnimationFrames(callback: () => void, deps?: DependencyList): void
}
