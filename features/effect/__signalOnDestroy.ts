import __BaseOfEffect from './__BaseOfEffect'

export default function __signalOnDestroy(effect: __BaseOfEffect): void {
    effect['__stateOfDestroy'] = 'destroying'

    if (effect['__children']) {
        effect['__children'].forEach(__signalOnDestroy)
    }

    if (effect['__effects']) {
        effect['__effects'].forEach(__signalOnDestroy)
    }
}
