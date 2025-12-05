import globalify from '@sky-modules/core/globalify'

import * as imports from '../drawing'

declare global {
    const parseBoxShadow: typeof imports.parseBoxShadow
    const roundedRect: typeof imports.roundedRect
    const drawBackground: typeof imports.drawBackground
    const drawBorder: typeof imports.drawBorder
    const drawBoxShadow: typeof imports.drawBoxShadow
    type ParsedBox = imports.ParsedBox
    type ParsedShadow = imports.ParsedShadow
}

globalify({ ...imports })
