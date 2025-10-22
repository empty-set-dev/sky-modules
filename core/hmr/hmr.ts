/// <reference types="vite/client" />

import type { ViteHotContext } from 'vite/types/hot.d.ts'

// TODO bun hmr
namespace Internal {
    export let isHot = false
}

export function isHot(): boolean {
    return Internal.isHot
}

export function Hmr(hot?: ViteHotContext): void {
    if (hot == null) {
        throw new Error("hot isn't supported")
    }

    Internal.isHot = true
    hot.dispose(() => {
        Internal.isHot = false
    })
}
