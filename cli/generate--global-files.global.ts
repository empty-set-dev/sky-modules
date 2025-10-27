import globalify from '@sky-modules/core/globalify'

import generateGlobalFilesCommand, * as imports from './generate--global-files'

declare global {
    const generateGlobalFilesCommand: typeof imports.default
    type generateGlobalFilesCommand = typeof imports.default
}

globalify({ generateGlobalFilesCommand })
