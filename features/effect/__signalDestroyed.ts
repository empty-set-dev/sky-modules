import { __LinksSymbol, __IsDestroyedSymbol, __LinksCountSymbol } from './__'

export default function __signalDestroyed(link: Root): void {
    if (link[__LinksCountSymbol] > 1) {
        return
    }

    link[__IsDestroyedSymbol] = false

    if (!link[__LinksSymbol]) {
        return
    }

    link[__LinksSymbol].forEach(__signalDestroyed)
}
