// import { DependencyList, useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { PageContext } from 'vike/types'

// import usePageContext from '../../../examples/react/old-render/usePageContext'

// import type { InitPageResult } from '../../../examples/react/old-render/initPage'

// interface PageDataResultBase {
//     title: string
//     description: string
//     ogTitle?: string
//     ogType?: string
//     ogImage?: string
//     preloads?: string[][]
//     noIndex?: boolean
// }
// export type PageDataResult<T = void> = T extends void
//     ? PageDataResultBase
//     : PageDataResultBase & {
//           data: T
//       }

// export default function useData<Data extends { data?: T }, T>(
//     handler: (pageContext: PageContext) => Promise<PageDataResultBase & Data>,
//     deps?: DependencyList
// ): {
//     isLoading: boolean
// } & Partial<PageDataResultBase> &
//     Data['data'] {
//     const pageContext = usePageContext() as PageContext

//     const [isLoading, setLoading] = useState(!afterHydration)
//     const [data, setData] = useState<undefined | Data>(
//         afterHydration ? (pageContext.data! as Data) : undefined
//     )

//     const { t } = useTranslation()

//     useEffect(() => {
//         if (afterHydration) {
//             return
//         }

//         task(load)

//         async function load(): Promise<void> {
//             pageContext.init = async (): Promise<InitPageResult> => ({
//                 domain: pageContext.domain,
//                 lng: pageContext.lng,
//                 lngPrefix: pageContext.lngPrefix,
//                 t,
//                 queryClient: (await import('../../../examples/react/old-render/queryClient'))
//                     .default,
//                 ip: pageContext.initial.ip,
//             })

//             as<{
//                 init: (pageContext: PageContext) => Promise<{ title: string; data: unknown }>
//             }>(handler)
//             const result = await handler.init(pageContext)

//             if (result.data) {
//                 setData(result.data as Data)
//             }

//             document.title = result.title

//             setLoading(false)
//         }
//     }, deps ?? [])

//     return {
//         isLoading,
//         ...data,
//     } as {
//         isLoading: boolean
//     } & Partial<PageDataResultBase> &
//         Data['data']
// }
