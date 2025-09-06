import globalify from 'sky/standard/globalify'

import * as lib from './Box'

declare global {}

globalify({ 'global-single-name': lib.default, ...lib })
