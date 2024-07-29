export default function __signalDestroyed(link: Root): void {
    if (link['__linksCount'] > 1) {
        return
    }

    link['__isDestroyed'] = false

    if (link['__links']) {
        link['__links'].forEach(__signalDestroyed)
    }
}
