import globalify from 'sky/standard/globalify'

import * as lib from './global-single-react-component'

declare global {}

globalify({ 'global-single-react-component': lib.default, ...lib })
