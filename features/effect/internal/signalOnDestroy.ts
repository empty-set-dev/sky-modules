import BaseOfEffect from './BaseOfEffect'

export default function signalOnDestroy(baseOfEffect: BaseOfEffect): void {
    baseOfEffect['__stateOfDestroy'] = 'destroying'

    if (baseOfEffect['__children']) {
        baseOfEffect['__children'].forEach(signalOnDestroy)
    }

    if (baseOfEffect['__effects']) {
        baseOfEffect['__effects'].forEach(signalOnDestroy)
    }
}
