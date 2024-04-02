import { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { CSSProperties, ReactNode } from 'react'
import globalify from 'utilities/globalify/-globalify'

import * as module from './Lottie'

globalify({ Lottie: module.default })

declare global {
    function Lottie(
        props: Omit<
            AnimationConfigWithPath<'svg'> & AnimationConfigWithData<'svg'>,
            'container'
        > & {
            className?: string
            style?: CSSProperties
            speed?: number
        }
    ): ReactNode
}
