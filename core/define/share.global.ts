import * as imports from './share'

declare global {
    type UpdateOfShared = imports.UpdateOfShared
    const UpdateOfShared: typeof imports.UpdateOfShared
    type UpdateOfSharedCallback = imports.UpdateOfSharedCallback
    const share: typeof imports.share
    const unshare: typeof imports.unshare
}

Object.assign(global, imports)
