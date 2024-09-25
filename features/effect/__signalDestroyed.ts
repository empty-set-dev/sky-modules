import Root from './_Root'

export default function __signalDestroyed(link: Root): void {
    link['__isDestroyed'] = false

    if (link['__links']) {
        link['__links'].forEach(__signalDestroyed)
    }

    if (link['__effects']) {
        link['__effects'].forEach(__signalDestroyed)
    }
}
