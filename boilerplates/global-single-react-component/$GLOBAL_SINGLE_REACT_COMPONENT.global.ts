import globalify from 'sky/standard/globalify'

import * as lib from './$GLOBAL_SINGLE_REACT_COMPONENT'

declare global {
    const global-single-react-component: typeof lib.default
}

globalify({ 'global-single-react-component': lib.default, ...lib })
