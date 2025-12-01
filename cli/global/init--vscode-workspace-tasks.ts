import globalify from '@sky-modules/core/globalify'

import initVscodeWorkspaceTasks, * as imports from '../init--vscode-workspace-tasks'

declare global {
    const initVscodeWorkspaceTasks: typeof imports.default
    type initVscodeWorkspaceTasks = typeof imports.default
}

globalify({ initVscodeWorkspaceTasks })
