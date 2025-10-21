/// <reference types="vite/client" />
import globalify from '../globalify'

import type { ViteHotContext } from 'vite/types/hot.d.ts'

declare global {
    const isHot: typeof lib.isHot
    const Hmr: typeof lib.Hmr
}
// TODO bun hmr
namespace local {
    export let isHot = false
}

namespace lib {
    export function isHot(): boolean {
        return local.isHot
    }

    export function Hmr(hot?: ViteHotContext): void {
        if (hot == null) {
            throw new Error("hot isn't supported")
        }

        local.isHot = true
        hot.dispose(() => {
            local.isHot = false
        })
    }
}

globalify(lib)
