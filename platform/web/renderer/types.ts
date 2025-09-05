import type { InitPageParameters, InitPageResult } from '#/renderer/initPage'

import type { DehydratedState, QueryClient } from 'pkgs/@tanstack/react-query'
import type { Resource, TFunction } from 'pkgs/i18next'

// https://vike.dev/pageContext#typescript
declare global {
    namespace Vike {
        interface PageContext {
            Page: () => React.ReactElement

            // server only
            init: (parameters: InitPageParameters) => Promise<InitPageResult>
            title: string
            description: string
            ogTitle?: string
            ogType?: string
            ogImage?: string
            preloads: undefined | string[][]
            noIndex?: boolean
            queryClient: QueryClient
            t: TFunction
            theme?: string

            domain: string
            lng: string
            lngPrefix: string
            urlLogical: string

            initial: {
                // store: Store
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
