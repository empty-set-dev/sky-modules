import { JSX } from 'sky-jsx'

export interface RouteMatch {
    path: string
    params: Record<string, string>
    Component: JSX.FunctionElement
}

export interface Route {
    path: string
    Component: JSX.FunctionElement
}

/**
 * Universal Router - file-based routing for Canvas/Three/React renderers
 *
 * Matches URL paths to screen components similar to react-router-dom
 */
export class UniversalRouter {
    private routes: Route[] = []
    private currentMatch: RouteMatch | null = null
    private listeners: Set<(match: RouteMatch | null) => void> = new Set()

    constructor(routes: Route[]) {
        this.routes = routes
        this.handleLocationChange()

        // Listen to browser navigation
        window.addEventListener('popstate', () => this.handleLocationChange())
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

    private handleLocationChange(): void {
        const path = window.location.pathname
        const match = this.matchRoute(path)

        if (match !== this.currentMatch) {
            this.currentMatch = match
            this.notifyListeners()
        }
    }

    private matchRoute(pathname: string): RouteMatch | null {
        for (const route of this.routes) {
            const match = this.matchPath(route.path, pathname)

            if (match) {
                return {
                    path: route.path,
                    params: match.params,
                    Component: route.Component,
                }
            }
        }

        return null
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
 * Create routes from screen files
 */
export function createRoutesFromScreens(
    screens: Record<string, { default: JSX.FunctionElement }>
): Route[] {
    const routes: Route[] = []

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
    routes.sort((a, b) => {
        const aSpecificity = a.path.split('/').length
        const bSpecificity = b.path.split('/').length

        return bSpecificity - aSpecificity
    })

    return routes
}
