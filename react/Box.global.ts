import globalify from 'sky/core/globalify'

import Box, * as lib from './Box'

import type { JSX } from 'react'

declare global {
    type BoxProps<T extends keyof JSX.IntrinsicElements> = lib.BoxProps<T>
    const Box: typeof lib.default
}

globalify({ Box, ...lib })
