import globalify from '@sky-modules/core/globalify'

import createWorkspaceConfig, * as imports from '../create--workspace-config'

declare global {
    const createWorkspaceConfig: typeof imports.default
    type createWorkspaceConfig = typeof imports.default
}

globalify({ createWorkspaceConfig })
