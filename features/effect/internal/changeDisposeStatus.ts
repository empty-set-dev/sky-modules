import BaseOfEffect from './BaseOfEffect'

export default function changeDisposeStatus(baseOfEffect: BaseOfEffect): void {
    baseOfEffect['_disposeStatus'] = 'disposing'

    if (baseOfEffect['_children']) {
        baseOfEffect['_children'].forEach(changeDisposeStatus)
    }

    if (baseOfEffect['_effects']) {
        baseOfEffect['_effects'].forEach(changeDisposeStatus)
    }
}
