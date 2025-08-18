import __EffectBase from './__EffectBase'

export default function __signalOnDestroy(effect: __EffectBase): void {
    effect['__stateOfDestroy'] = 'destroying'

    if (effect['__children']) {
        effect['__children'].forEach(__signalOnDestroy)
    }

    if (effect['__effects']) {
        effect['__effects'].forEach(__signalOnDestroy)
    }
}
