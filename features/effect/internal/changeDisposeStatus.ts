import internal from '.'

export default function changeDisposeStatus(baseOfEffect: internal.BaseOfEffect): void {
    baseOfEffect['_disposeStatus'] = 'disposing'

    if (baseOfEffect['_children']) {
        baseOfEffect['_children'].forEach(changeDisposeStatus)
    }

    if (baseOfEffect['_effects']) {
        baseOfEffect['_effects'].forEach(changeDisposeStatus)
    }
}
