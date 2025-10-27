import globalify from '@sky-modules/core/globalify'

import * as imports from './errors'

declare global {
    const DefineError: typeof imports.DefineError
    type DefineError = typeof imports.DefineError
    const DuplicateDefineError: typeof imports.DuplicateDefineError
    type DuplicateDefineError = typeof imports.DuplicateDefineError
    const InvalidDefineNameError: typeof imports.InvalidDefineNameError
    type InvalidDefineNameError = typeof imports.InvalidDefineNameError
    const RuntimeDefineError: typeof imports.RuntimeDefineError
    type RuntimeDefineError = typeof imports.RuntimeDefineError
    const ValidationError: typeof imports.ValidationError
    type ValidationError = typeof imports.ValidationError
    const SchemaError: typeof imports.SchemaError
    type SchemaError = typeof imports.SchemaError
    const InvalidSchemaError: typeof imports.InvalidSchemaError
    type InvalidSchemaError = typeof imports.InvalidSchemaError
    const ObserveError: typeof imports.ObserveError
    type ObserveError = typeof imports.ObserveError
    const NoListenersError: typeof imports.NoListenersError
    type NoListenersError = typeof imports.NoListenersError
    const CallbackNotFoundError: typeof imports.CallbackNotFoundError
    type CallbackNotFoundError = typeof imports.CallbackNotFoundError
    const RuntimeSharingError: typeof imports.RuntimeSharingError
    type RuntimeSharingError = typeof imports.RuntimeSharingError
    const UnknownObjectError: typeof imports.UnknownObjectError
    type UnknownObjectError = typeof imports.UnknownObjectError
    const UnknownSchemaError: typeof imports.UnknownSchemaError
    type UnknownSchemaError = typeof imports.UnknownSchemaError
}

globalify({ ...imports })
