import globalify from '@sky-modules/core/globalify'
import * as imports from './errors'

declare global {
    const DefineError: typeof imports.DefineError
    const DuplicateDefineError: typeof imports.DuplicateDefineError
    const InvalidDefineNameError: typeof imports.InvalidDefineNameError
    const RuntimeDefineError: typeof imports.RuntimeDefineError
    const ValidationError: typeof imports.ValidationError
    const SchemaError: typeof imports.SchemaError
    const InvalidSchemaError: typeof imports.InvalidSchemaError
    const ObserveError: typeof imports.ObserveError
    const NoListenersError: typeof imports.NoListenersError
    const CallbackNotFoundError: typeof imports.CallbackNotFoundError
    const RuntimeSharingError: typeof imports.RuntimeSharingError
    const UnknownObjectError: typeof imports.UnknownObjectError
    const UnknownSchemaError: typeof imports.UnknownSchemaError
}

globalify({ ...imports })
