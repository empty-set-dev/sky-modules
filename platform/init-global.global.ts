import { runsOnSide } from './utilities'

declare global {
    const global: typeof globalThis

    interface Window {
        global: typeof globalThis
    }
}

initGlobal()

function initGlobal(): void {
    if (runsOnSide === 'client') {
        window.global = window
    }
}
