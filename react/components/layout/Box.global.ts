import { HTMLElementType } from 'react'
import globalify from 'sky/standard/globalify'

import Box, * as lib from './Box'

declare global {
    interface BoxProps extends lib.BoxProps {}
    function Box<T extends HTMLElementType = 'div'>(props: BoxProps & { as?: T }): ReactNode
}

globalify({ Box, ...lib })
