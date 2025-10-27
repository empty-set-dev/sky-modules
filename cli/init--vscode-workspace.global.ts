import globalify from '@sky-modules/core/globalify'

import initVscodeWorkspace, * as imports from './init--vscode-workspace'

declare global {
    const initVscodeWorkspace: typeof imports.default
    type initVscodeWorkspace = typeof imports.default
}

globalify({ initVscodeWorkspace })
