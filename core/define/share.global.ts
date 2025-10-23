import globalify from '@sky-modules/core/globalify'
import * as imports from './share'

declare global {
    const share: typeof imports.share
    const unshare: typeof imports.unshare
    const Type: typeof imports.Type
    type Pretty = typeof imports.Pretty
    type primitive = typeof imports.primitive
    type PrettyType = typeof imports.PrettyType
    type PrettyCreate = typeof imports.PrettyCreate
    type PrettyDestroy = typeof imports.PrettyDestroy
    type PrettySet = typeof imports.PrettySet
    type PrettyCall = typeof imports.PrettyCall
    type Create = typeof imports.Create
    type Destroy = typeof imports.Destroy
    type Set = typeof imports.Set
    type Call = typeof imports.Call
    type UpdateOfShared = typeof imports.UpdateOfShared
    type UpdateOfSharedCallback = typeof imports.UpdateOfSharedCallback
}

globalify({ ...imports })
