import globalify from '@sky-modules/core/globalify'

import EnabledMixin, * as imports from '../EnabledMixin'

declare global {
    const EnabledMixin: typeof imports.default
    type EnabledMixin = typeof imports.default
}

globalify({ EnabledMixin })
