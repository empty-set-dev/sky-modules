import globalify from 'sky/standard/globalify'

import * as lib from './global-single-module'

declare global {}

globalify({ 'global-single-name': lib.default, ...lib })
