import globalify from 'sky/standard/globalify'

import * as lib from './Box'

declare global {}

globalify({ Box: lib.default, ...lib })
