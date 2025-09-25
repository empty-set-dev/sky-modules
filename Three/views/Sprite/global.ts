import globalify from 'sky/standard/globalify'

import * as lib from '.'

globalify({ Sprite: lib.default })

declare global {
    class Sprite extends lib.default {}
}
