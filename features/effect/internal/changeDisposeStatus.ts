import BaseOfEffect from './BaseOfEffect'

export default function changeDisposeStatus(baseOfEffect: BaseOfEffect): void {
    baseOfEffect['__disposeStatus'] = 'disposing'

    if (baseOfEffect['__children']) {
        baseOfEffect['__children'].forEach(changeDisposeStatus)
    }

    if (baseOfEffect['__effects']) {
        baseOfEffect['__effects'].forEach(changeDisposeStatus)
    }
}
