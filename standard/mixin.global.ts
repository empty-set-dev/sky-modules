import globalify from 'sky/standard/globalify'

import mixin, * as lib from './mixin'

declare global {
    function mixin<MT extends Class, T extends Class>(
        mixinConstructor: MT
    ): (constructor: T) => void
}

globalify({ mixin, ...lib })
