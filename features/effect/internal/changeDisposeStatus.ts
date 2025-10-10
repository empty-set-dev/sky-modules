import internal from '.'

/**
 * Recursively marks an effect and all its children/dependencies as "disposing".
 *
 * This function is called during the disposal process to set the dispose status
 * on an effect tree before actual cleanup begins. It prevents new operations
 * from being queued while disposal is in progress.
 *
 * The function traverses:
 * - All child effects (_children)
 * - All dependent effects (_effects)
 *
 * @param baseOfEffect The effect to mark as disposing (along with its tree)
 */
export default function changeDisposeStatus(baseOfEffect: internal.BaseOfEffect): void {
    baseOfEffect['_disposeStatus'] = 'disposing'

    if (baseOfEffect['_children']) {
        baseOfEffect['_children'].forEach(changeDisposeStatus)
    }

    if (baseOfEffect['_effects']) {
        baseOfEffect['_effects'].forEach(changeDisposeStatus)
    }
}
