import globalify from 'sky/core/globalify'

import $GLOBAL_SINGLE_REACT_COMPONENT, * as lib from './{{GLOBAL_SINGLE_REACT_COMPONENT}}'

declare global {
    const $GLOBAL_SINGLE_REACT_COMPONENT: typeof lib.default
}

globalify({ $GLOBAL_SINGLE_REACT_COMPONENT, ...lib })
