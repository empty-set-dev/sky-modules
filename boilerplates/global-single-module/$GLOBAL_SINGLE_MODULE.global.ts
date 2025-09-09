import globalify from 'sky/standard/globalify'

import $GLOBAL_SINGLE_MODULE, * as lib from './$GLOBAL_SINGLE_MODULE'

declare global {}

globalify({ $GLOBAL_SINGLE_MODULE, ...lib })
