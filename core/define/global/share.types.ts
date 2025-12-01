import globalify from '@sky-modules/core/globalify'

import * as imports from '../share.types'

declare global {
    const Type: typeof imports.Type
    type PrettyType = imports.PrettyType
    type PrettyCreate = imports.PrettyCreate
    type PrettyDestroy = imports.PrettyDestroy
    type PrettySet = imports.PrettySet
    type PrettyCall = imports.PrettyCall
    type Create = imports.Create
    type Destroy = imports.Destroy
    type Set = imports.Set
    type Call = imports.Call
    type UpdateOfShared = imports.UpdateOfShared
    type UpdateOfSharedCallback = imports.UpdateOfSharedCallback
}

globalify({ ...imports })
