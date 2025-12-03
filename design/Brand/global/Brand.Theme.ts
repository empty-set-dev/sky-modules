import globalify from '@sky-modules/core/globalify'

import Brand_Theme, * as imports from '../Brand.Theme'

declare global {
    const Brand_Theme: typeof imports.default
    type Brand_Theme = typeof imports.default
    type ThemeMode = imports.ThemeMode
}

globalify({ Brand_Theme })
