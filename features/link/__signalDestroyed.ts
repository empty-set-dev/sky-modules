import { __LINKS, __IS_DESTROYED, __LINKS_COUNT } from './__'

export default function __signalDestroyed(link: Root): void {
    if (link[__LINKS_COUNT] > 1) {
        return
    }

    link[__IS_DESTROYED] = false

    if (!link[__LINKS]) {
        return
    }

    link[__LINKS].forEach(__signalDestroyed)
}
