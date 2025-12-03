import globalify from '@sky-modules/core/globalify'

import Brand_Palette, * as imports from '../Brand.Palette'

declare global {
    const Brand_Palette: typeof imports.default
    type Brand_Palette = typeof imports.default
    type AutoDarkConfig = imports.AutoDarkConfig
}

globalify({ Brand_Palette })
