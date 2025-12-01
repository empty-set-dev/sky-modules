import { runsOnSide } from '../utilities'

declare global {
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
