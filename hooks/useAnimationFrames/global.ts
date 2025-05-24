import { DependencyList } from 'react'
import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify({ useAnimationFrames: module.default })

declare global {
    function useAnimationFrames(callback: () => void, deps?: DependencyList): void
}
