import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify(pkg)

declare global {
    function errorConsole(message?: unknown, ...optionalParams: unknown[]): void
    function infoConsole(message?: unknown, ...optionalParams: unknown[]): void
    function logConsole(message?: unknown, ...optionalParams: unknown[]): void
    function timeConsole(label?: string): void
    function timeEndConsole(label?: string): void
    function traceConsole(message?: unknown, ...optionalParams: unknown[]): void
    function debugConsole(message?: unknown, ...optionalParams: unknown[]): void
    function tableConsole(...data: unknown[]): void
    function groupCollapsedConsole(label?: string): void
    function groupEndConsole(): void
    function groupConsole(label?: string): void
}
