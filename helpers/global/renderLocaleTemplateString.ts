import globalify from '@sky-modules/core/globalify'

import renderLocaleTemplateString, * as imports from '../renderLocaleTemplateString'

declare global {
    const renderLocaleTemplateString: typeof imports.default
    type renderLocaleTemplateString = typeof imports.default
}

globalify({ renderLocaleTemplateString })
