import type Store from '#/Store'

import type { InitPageOptions, InitPageResult } from './initPage'
import type { DehydratedState, QueryClient } from '@pkgs/@tanstack/react-query'
import type { Resource, TFunction } from 'i18next'

// https://vike.dev/pageContext#typescript
declare global {
    var afterHydration: boolean

    interface ImportMeta {
        readonly env: {
            [x: string]: undefined | string
        }
    }

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
            client: QueryClient
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
