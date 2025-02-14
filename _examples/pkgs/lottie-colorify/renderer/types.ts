import type { InitPageOptions, InitPageResult } from './initPage'
import type Store from '../../@artsy/fresnel/Store'
import type { Resource, TFunction } from 'pkgs/i18next'
import type { DehydratedState, QueryClient } from 'sky/pkgs/@tanstack/react-query'

// https://vike.dev/pageContext#typescript
declare global {
    var afterHydration: boolean

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
