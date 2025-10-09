// import { HydrationBoundary, QueryClient, QueryClientProvider } from 'pkgs/@tanstack/react-query'
// import { PropsWithChildren, ReactNode, useEffect } from 'react'
// // import { MediaContextProvider } from '@sky-modules/platform/web/media/MediaProvider'
// import { PageContextProvider } from '@sky-modules/react/PageContext'
// import { SearchParamsContextProvider } from '@sky-modules/react/providers/SearchParamsContext'
// import StoreContext from '@sky-modules/react/providers/StoreContext'
// import { ThemeContextProvider } from '@sky-modules/react/providers/ThemeContext'
// import Console from '@sky-modules/core/Console'

// import TranslationsProvider from '../../../playground/react/old-render/TranslationsProvider'

// import type { PageContext } from 'vike/types'

// export interface PageProvidersProps extends PropsWithChildren {
//     pageContext: PageContext
//     queryClient: QueryClient
// }
// export default function PageProviders(props: PageProvidersProps): ReactNode {
//     const {
//         pageContext,
//         pageContext: {
//             lng,
//             // initial: { store, ns, resources, dehydratedState },
//         },
//         queryClient,
//         children,
//     } = props

//     Console.debug('Render page', pageContext.urlOriginal)

//     // useEffect(() => {
//     //     setTimeout(() => {
//     //         global.afterHydration = false
//     //     }, 0)
//     // }, [])

//     return (
//         <PageContextProvider pageContext={pageContext}>
//             {/* <StoreContext.Provider value={store}> */}
//             {/* <TranslationsProvider lng={lng} ns={ns} resources={resources}> */}
//             <QueryClientProvider client={queryClient}>
//                 {/* <HydrationBoundary state={dehydratedState} queryClient={queryClient}> */}
//                 <SearchParamsContextProvider>
//                     {/* <MediaContextProvider> */}
//                     {/* <ThemeContextProvider theme={pageContext.theme}> */}
//                     {children}
//                     {/* </ThemeContextProvider> */}
//                     {/* </MediaContextProvider> */}
//                 </SearchParamsContextProvider>
//                 {/* </HydrationBoundary> */}
//             </QueryClientProvider>
//             {/* </TranslationsProvider> */}
//             {/* </StoreContext.Provider> */}
//         </PageContextProvider>
//     )
// }
