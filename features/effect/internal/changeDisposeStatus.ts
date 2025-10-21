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
 * @param EffectBase The effect to mark as disposing (along with its tree)
 */
export default function changeDisposeStatus(EffectBase: internal.EffectBase): void {
    EffectBase['_disposeStatus'] = 'disposing'

    if (EffectBase['_children']) {
        EffectBase['_children'].forEach(changeDisposeStatus)
    }

    if (EffectBase['_effects']) {
        EffectBase['_effects'].forEach(changeDisposeStatus)
    }
}
