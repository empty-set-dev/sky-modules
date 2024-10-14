import { DehydratedState, QueryClient } from '@tanstack/react-query'
import { Resource } from 'i18next'

import Store from '../Store'

// https://vike.dev/pageContext#typescript
declare global {
    namespace Vike {
        interface PageContext {
            Page: () => React.ReactElement

            urlLogical: string

            title: string
            description: string
            ogTitle?: string
            ogType?: string
            ogImage?: string
            domain: string
            lng: string
            lngPrefix: string
            client: QueryClient
            preloads: undefined | string[][]
            noIndex?: boolean

            data: {
                domain: string
                lng: string
                lngPrefix: string
                urlLogical: string
                store: Store
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

// Tell TypeScript this file isn't an ambient module
export {}
