import globalify from '@sky-modules/core/globalify'

import Mitosis, * as imports from './Mitosis'

declare global {
    const Mitosis: typeof imports.default
    type Mitosis = typeof imports.default
    type Node = imports.Node
    type Children = imports.Children
    type Ref = imports.Ref
}

globalify({ Mitosis, ...imports })
