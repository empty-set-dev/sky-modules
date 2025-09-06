import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    'global-module': typeof lib.default
}

globalify({ 'global-module': lib.default, ...lib })
