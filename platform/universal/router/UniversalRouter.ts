import { JSX } from 'sky-jsx'

/**
 * Matched route with resolved component and extracted params
 */
export interface RouteMatch {
    /** Matched route path pattern */
    path: string
    /** Extracted URL parameters from dynamic segments */
    params: Record<string, string>
    /** Resolved component (loaded or loading placeholder) */
    Component: JSX.FC
    /** Whether component is still loading (lazy loaded) */
    isLoading?: boolean
}

/**
 * Route definition with path pattern and component
 */
export interface Route {
    /** Route path pattern (e.g., '/users/:id') */
    path: string
    /** Component or lazy-loaded component factory */
    Component: JSX.FC | (() => Promise<JSX.FC>)
}

/**
 * Universal Router - client-side routing for cross-platform applications
 *
 * Provides file-based routing similar to react-router-dom but works with
 * Canvas/Three/React renderers and any JSX-based framework.
 *
 * Features:
 * - Dynamic route parameters (e.g., '/users/:id')
 * - Lazy loading with loading states
 * - Browser history integration (popstate)
 * - Not found (404) component support
 * - Route specificity sorting
 *
 * @example Basic usage
 * ```ts
 * import { UniversalRouter, createRoutesFromScreens } from '@sky-modules/platform/universal/router'
 *
 * const routes = createRoutesFromScreens({
 *   './index.tsx': { default: HomePage },
 *   './users/[id].tsx': { default: UserPage }
 * })
 *
 * const router = new UniversalRouter(routes, {
 *   notFound: NotFoundPage,
 *   loading: LoadingPage
 * })
 *
 * router.subscribe(match => {
 *   console.log('Route changed:', match)
 * })
 *
 * router.navigate('/users/123')
 * ```
 *
 * @example Lazy loading
 * ```ts
 * const routes = [{
 *   path: '/heavy',
 *   Component: () => import('./HeavyPage')
 * }]
 *
 * const router = new UniversalRouter(routes, {
 *   loading: () => <div>Loading...</div>
 * })
 * ```
 *
 * @example Global usage
 * ```ts
 * import '@sky-modules/platform/universal/router/global'
 *
 * const router = new UniversalRouter(routes)
 * ```
 */
export class UniversalRouter {
    private routes: Route[] = []
    private currentMatch: RouteMatch | null = null
    private listeners: Set<(match: RouteMatch | null) => void> = new Set()
    private notFoundComponent: JSX.FC | null = null
    private loadingComponent: JSX.FC | null = null
    private loadedComponents = new Map<string, JSX.FC>()
    private popstateHandler = (): Promise<void> => this.handleLocationChange()

    constructor(routes: Route[], options?: { notFound?: JSX.FC; loading?: JSX.FC }) {
        this.routes = routes
        this.notFoundComponent = options?.notFound ?? null
        this.loadingComponent = options?.loading ?? null
        this.handleLocationChange()

        // Listen to browser navigation
        window.addEventListener('popstate', this.popstateHandler)
    }

    /**
     * Clean up resources and remove event listeners
     */
    destroy(): void {
        window.removeEventListener('popstate', this.popstateHandler)
        this.listeners.clear()
        this.loadedComponents.clear()
        this.currentMatch = null
    }

    /**
     * Navigate to a new path
     */
    navigate(path: string): void {
        window.history.pushState({}, '', path)
        this.handleLocationChange()
    }

    /**
     * Get current route match
     */
    getCurrentMatch(): RouteMatch | null {
        return this.currentMatch
    }

    /**
     * Subscribe to route changes
     */
    subscribe(listener: (match: RouteMatch | null) => void): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private async handleLocationChange(): Promise<void> {
        const path = window.location.pathname
        const match = await this.matchRoute(path)

        // Compare actual values instead of object references
        const hasChanged =
            match?.path !== this.currentMatch?.path ||
            JSON.stringify(match?.params) !== JSON.stringify(this.currentMatch?.params)

        if (hasChanged) {
            this.currentMatch = match
            this.notifyListeners()
        }
    }

    private async matchRoute(pathname: string): Promise<RouteMatch | null> {
        for (const route of this.routes) {
            const match = this.matchPath(route.path, pathname)

            if (match) {
                const component = await this.loadComponent(route)
                const isLoading = component === this.loadingComponent
                return {
                    path: route.path,
                    params: match.params,
                    Component: component,
                    isLoading,
                }
            }
        }

        // Return 404 component if no route matches
        if (this.notFoundComponent) {
            return {
                path: pathname,
                params: {},
                Component: this.notFoundComponent,
            }
        }

        return null
    }

    private async loadComponent(route: Route): Promise<JSX.FC> {
        // Check if already loaded
        const cached = this.loadedComponents.get(route.path)

        if (cached) {
            return cached
        }

        // Check if it's a lazy loaded component by trying to call it
        // If it returns a Promise, it's lazy loaded
        let isLazyComponent = false
        let loadPromise: Promise<JSX.FC> | null = null

        try {
            const result = (route.Component as any)()
            isLazyComponent = result instanceof Promise

            if (isLazyComponent) {
                loadPromise = result
            }
        } catch {
            // Not a lazy component, just a regular one
            isLazyComponent = false
        }

        if (isLazyComponent && loadPromise) {
            // Return loading component immediately if available
            if (this.loadingComponent) {
                // Load component in background
                loadPromise
                    .then(component => {
                        this.loadedComponents.set(route.path, component)
                        // Update current match with loaded component
                        if (this.currentMatch?.path === route.path && this.currentMatch.isLoading) {
                            this.currentMatch = {
                                ...this.currentMatch,
                                Component: component,
                                isLoading: false,
                            }
                            this.notifyListeners()
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to load component for route ${route.path}:`, error)
                    })

                return this.loadingComponent
            }

            // No loading component, wait for load
            try {
                const component = await loadPromise
                this.loadedComponents.set(route.path, component)
                return component
            } catch (error) {
                console.error(`Failed to load component for route ${route.path}:`, error)

                if (this.notFoundComponent) {
                    return this.notFoundComponent
                }

                throw new Error
            }
        }

        // Regular component
        const component = route.Component as JSX.FC
        this.loadedComponents.set(route.path, component)
        return component
    }

    private matchPath(
        routePath: string,
        pathname: string
    ): { params: Record<string, string> } | null {
        // Convert route path to regex pattern
        const paramNames: string[] = []
        const pattern = routePath.replace(/\//g, '\\/').replace(/:(\w+)/g, (_, paramName) => {
            paramNames.push(paramName)
            return '([^\\/]+)'
        })

        const regex = new RegExp(`^${pattern}$`)
        const match = pathname.match(regex)

        if (!match) return null

        const params: Record<string, string> = {}
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1]
        })

        return { params }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentMatch))
    }
}

/**
 * Screen module with default export (component or lazy component)
 */
export interface ScreenModule {
    default: JSX.FC | (() => Promise<JSX.FC>)
}

/**
 * Vite page route from vite-plugin-pages
 */
export interface VitePageRoute {
    /** Route name identifier */
    name: string
    /** Route path pattern */
    path: string
    /** Component or lazy-loaded component */
    component: JSX.FC | (() => Promise<JSX.FC>)
    /** Whether route accepts props */
    props?: boolean
}

/**
 * Create routes from screen files or vite-plugin-pages output
 *
 * Converts file-based screen modules into router-compatible routes.
 * Supports two formats:
 * 1. Record format: file paths as keys, modules as values
 * 2. Array format: vite-plugin-pages output
 *
 * File path conventions:
 * - `./index.tsx` -> `/`
 * - `./about.tsx` -> `/about`
 * - `./users/[id].tsx` -> `/users/:id`
 *
 * Routes are automatically sorted by specificity (static before dynamic).
 *
 * @param screens - Screen modules or vite-plugin-pages routes
 * @returns Sorted array of routes
 *
 * @example Record format
 * ```ts
 * const routes = createRoutesFromScreens({
 *   './index.tsx': { default: HomePage },
 *   './about.tsx': { default: AboutPage },
 *   './users/[id].tsx': { default: UserPage }
 * })
 * ```
 *
 * @example Vite-plugin-pages format
 * ```ts
 * import pages from '~pages'
 *
 * const routes = createRoutesFromScreens(pages)
 * ```
 */
export function createRoutesFromScreens(
    screens: Record<string, ScreenModule> | VitePageRoute[]
): Route[] {
    const routes: Route[] = []

    // Check if screens is an array (vite-plugin-pages format)
    if (Array.isArray(screens)) {
        for (const route of screens) {
            routes.push({
                path: route.path,
                Component: route.component,
            })
        }

        // Sort by specificity
        routes.sort((a, b) => {
            const aHasParams = a.path.includes(':')
            const bHasParams = b.path.includes(':')

            if (aHasParams !== bHasParams) {
                return aHasParams ? 1 : -1
            }

            const aSegments = a.path.split('/').length
            const bSegments = b.path.split('/').length

            return bSegments - aSegments
        })

        return routes
    }

    // Record format
    for (const [path, module] of Object.entries(screens)) {
        // Convert file path to route path
        // e.g., ./index.tsx -> /
        // e.g., ./playground.tsx -> /playground
        // e.g., ./users/[id].tsx -> /users/:id

        let routePath = path
            .replace(/^\.\//, '')
            .replace(/\.tsx?$/, '')
            .replace(/\/index$/, '')
            .replace(/\[(\w+)\]/g, ':$1')

        if (routePath === 'index') {
            routePath = '/'
        } else if (!routePath.startsWith('/')) {
            routePath = `/${routePath}`
        }

        routes.push({
            path: routePath,
            Component: module.default,
        })
    }

    // Sort routes by specificity (more specific routes first)
    // 1. Static routes before dynamic routes
    // 2. More path segments before fewer segments
    routes.sort((a, b) => {
        const aHasParams = a.path.includes(':')
        const bHasParams = b.path.includes(':')

        // Static routes are more specific than dynamic routes
        if (aHasParams !== bHasParams) {
            return aHasParams ? 1 : -1
        }

        // If both are static or both are dynamic, longer paths are more specific
        const aSegments = a.path.split('/').length
        const bSegments = b.path.split('/').length

        return bSegments - aSegments
    })

    return routes
}
