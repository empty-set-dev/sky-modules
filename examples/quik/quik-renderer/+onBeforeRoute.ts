import 'sky/design/plugins/tailwind.css'

import type { PageContext } from 'vike/types'

export interface OnBeforeRouteResult {
    pageContext: {
        urlLogical: string
        quikEnabled: boolean
    }
}

export default function onBeforeRoute(pageContext: PageContext): OnBeforeRouteResult {
    const { pathname } = pageContext.urlParsed

    const urlLogical = pathname

    return {
        pageContext: {
            urlLogical,
            quikEnabled: true,
        },
    }
}
