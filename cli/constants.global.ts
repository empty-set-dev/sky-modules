import globalify from '@sky-modules/core/globalify'

import * as imports from './constants'

declare global {
    const CLI_CONSTANTS: typeof imports.CLI_CONSTANTS
    const ExitCode: typeof imports.ExitCode
    type CliConstants = imports.CliConstants
}

globalify({ ...imports })
