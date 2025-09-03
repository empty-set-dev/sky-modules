import globalify from 'sky/standard/globalify'

import * as lib from '.'

declare global {
    
}

globalify({ 'global-module': lib, ...lib })
