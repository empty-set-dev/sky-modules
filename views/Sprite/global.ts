import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify({ Sprite: pkg.default })

declare global {
    class Sprite extends pkg.default {}
}
