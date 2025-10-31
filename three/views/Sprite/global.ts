import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ Sprite: lib.default })

declare global {
    class Sprite extends lib.default {}
}
