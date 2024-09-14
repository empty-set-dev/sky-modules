import { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { CSSProperties, ReactNode } from 'react'
import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ Lottie: pkg.default })

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
