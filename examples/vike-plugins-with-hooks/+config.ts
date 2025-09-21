import {
    createVikeConfig,
    reactPlugin,
    tailwindPlugin,
    seoPlugin,
    analyticsPlugin,
    loadingPlugin,
    conditionalPlugin,
    isDev,
    isProd,
} from 'sky/platform/web/plugins'

// Example: Plugin system with hooks
export default createVikeConfig()
    .use(reactPlugin({
        strictMode: true,
        streaming: true
    }))
    .use(tailwindPlugin({
        darkMode: 'class'
    }))
    .use(seoPlugin({
        defaultTitle: 'My Amazing App with Hooks',
        siteName: 'Amazing Hooks',
        defaultDescription: 'App with powerful vike plugin hooks',
    }))
    .use(loadingPlugin({
        showProgressBar: true,
        minDelay: 300,
        position: 'top',
    }))
    .when(isDev, analyticsPlugin({
        trackingId: 'dev-analytics-id',
        enableDev: true,
        trackPageViews: true,
    }))
    .when(isProd, analyticsPlugin({
        trackingId: 'prod-analytics-id',
        enableDev: false,
        trackPageViews: true,
        anonymizeIp: true,
    }))
    .build()

// Example hooks that will be automatically executed:
// ✅ onBeforeRoute - Analytics tracking starts
// ✅ onRenderClient - Analytics initialized, Loading system ready
// ✅ onPageTransitionStart - Loading indicator shows
// ✅ onPageTransitionEnd - Loading indicator hides, Analytics tracks page view
// ✅ onHydrationEnd - Analytics and Loading systems fully initialized