/* eslint-disable no-console */
export function clearConsole(): void {
    console.clear()
}
export function errorConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams)
}
export function infoConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.info(message, ...optionalParams)
}
export function logConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.log(message, ...optionalParams)
}
export function warnConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams)
}
export function traceConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.trace(message, ...optionalParams)
}
export function debugConsole(message?: unknown, ...optionalParams: unknown[]): void {
    console.debug(message, ...optionalParams)
}
export function timeConsole(label?: string): void {
    console.time(label)
}
export function timeEndConsole(label?: string): void {
    console.timeEnd(label)
}
export function tableConsole(...data: unknown[]): void {
    console.table(...data)
}
export function groupCollapsedConsole(label?: string): void {
    console.groupCollapsed(label)
}
export function groupEndConsole(): void {
    console.groupEnd()
}
export function groupConsole(label?: string): void {
    console.groupCollapsed(label)
}
