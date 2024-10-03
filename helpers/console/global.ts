import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify(pkg)

declare global {
    function traceConsole(message?: unknown, ...optionalParams: unknown[]): void
    function debugConsole(message?: unknown, ...optionalParams: unknown[]): void
    function tableConsole(...data: unknown[]): void
    function groupCollapsedConsole(label?: string): void
    function groupEndConsole(): void
    function groupConsole(label?: string): void
}
