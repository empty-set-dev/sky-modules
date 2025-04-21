export default function __signalDestroyed(link: EffectsRoot): void {
    link['__isDestroyed'] = false

    if (link['__children']) {
        link['__children'].forEach(__signalDestroyed)
    }

    if (link['__effects']) {
        link['__effects'].forEach(__signalDestroyed)
    }
}
