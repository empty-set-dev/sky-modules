import globalify from 'sky/standard/globalify'

import Box, * as lib from './Box'

declare global {
    interface BoxProps extends lib.BoxProps {}
    function Box<T extends keyof HTMLElementTagNameMap = 'div'>(
        props: BoxProps & { as?: T }
    ): ReactNode
}

globalify({ Box, ...lib })
