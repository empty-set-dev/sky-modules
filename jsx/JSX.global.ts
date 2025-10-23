import globalify from '@sky-modules/core/globalify'

import JSX, * as imports from './JSX'

declare global {
    const JSX: typeof imports.default
    type JSX = typeof imports.default
    type Element = imports.Element
    type FC = imports.FC
    type Node = imports.Node
    type Return = imports.Return
}

globalify({ JSX, ...imports })
