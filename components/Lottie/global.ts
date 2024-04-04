import globalify from 'helpers/globalify'
import { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { CSSProperties, ReactNode } from 'react'

import * as module from '.'

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
