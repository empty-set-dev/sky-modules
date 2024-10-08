export default function __signalDestroyed(link: EffectsRoot): void {
    link['__isDestroyed'] = false

    if (link['__links']) {
        link['__links'].forEach(__signalDestroyed)
    }

    if (link['__effects']) {
        link['__effects'].forEach(__signalDestroyed)
    }
}
