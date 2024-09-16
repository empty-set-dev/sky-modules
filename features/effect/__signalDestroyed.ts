export default function __signalDestroyed(link: Root): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkAsAny = link as any

    if (linkAsAny['__linksCount'] > 1) {
        return
    }

    linkAsAny['__isDestroyed'] = false

    if (linkAsAny['__links']) {
        linkAsAny['__links'].forEach(__signalDestroyed)
    }
}
