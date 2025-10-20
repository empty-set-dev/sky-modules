import { runsOnSide } from './utilities'

initGlobal()

function initGlobal(): void {
    if (runsOnSide === 'client') {
        window.global = window
    }
}
