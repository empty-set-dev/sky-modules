import globalify from 'sky/standard/globalify'

import * as lib from './{{GLOBAL_SINGLE_REACT_COMPONENT}}'

declare global {
    const $GLOBAL_SINGLE_REACT_COMPONENT: typeof lib.default
}

globalify({ $GLOBAL_SINGLE_REACT_COMPONENT: lib.default, ...lib })
