import type { InitPageOptions, InitPageResult } from '#/renderer/initPage'
import type Store from '#/Store'

import type { DehydratedState, QueryClient } from '@tanstack/react-query'
import type { Resource, TFunction } from 'pkgs/i18next'

export {}

// https://vike.dev/pageContext#typescript
declare global {
    let afterHydration: boolean

    namespace Vike {
        interface PageContext {
            Page: () => React.ReactElement

            // server only
            init: (options: InitPageOptions) => Promise<InitPageResult>
            title: string
            description: string
            ogTitle?: string
            ogType?: string
            ogImage?: string
            preloads: undefined | string[][]
            noIndex?: boolean
            queryClient: QueryClient
            t: TFunction

            domain: string
            lng: string
            lngPrefix: string
            urlLogical: string

            initial: {
                store: Store
                title: string
                dehydratedState: DehydratedState
                ns: string[]
                resources: Resource
                ip: string
            }

            /** https://vike.dev/render */
            abortReason?: string
        }
    }
}
