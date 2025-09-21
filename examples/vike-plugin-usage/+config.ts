import {
    createVikeConfig,
    reactPlugin,
    tailwindPlugin,
    seoPlugin,
    asyncDataPlugin,
    conditionalPlugin,
    isDev,
    isProd,
} from 'sky/platform/web/plugins'

// Example 1: Simple usage
export default createVikeConfig()
    .use(reactPlugin({ strictMode: true, streaming: true }))
    .use(tailwindPlugin({ darkMode: 'class' }))
    .use(
        seoPlugin({
            defaultTitle: 'My Amazing App',
            siteName: 'Amazing',
            defaultDescription: 'The most amazing app ever built',
        })
    )
    .use(asyncDataPlugin({ timeout: 10000, cache: true }))
    .build()

// Example 2: Conditional plugins
// export default createVikeConfig()
//     .use(reactPlugin())
//     .use(tailwindPlugin())
//     .when(isDev, asyncDataPlugin({ retry: false }))
//     .when(isProd, seoPlugin({ openGraph: true }))
//     .build()

// Example 3: Environment-specific configuration
// export default createVikeConfig({ isDev: process.env.NODE_ENV === 'development' })
//     .use(reactPlugin({ ssr: isProd }))
//     .use(conditionalPlugin(isDev, tailwindPlugin({ purge: false })))
//     .use(conditionalPlugin(isProd, tailwindPlugin({ purge: true })))
//     .build()

// Example 4: Multiple plugins at once
// export default createVikeConfig()
//     .useMany([
//         reactPlugin({ strictMode: false }),
//         tailwindPlugin(),
//         seoPlugin(),
//         asyncDataPlugin(),
//     ])
//     .build()