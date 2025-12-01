import '@sky-modules/platform'

import '~project/App'

import { createRoot, Root } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import type { FC, ReactNode } from 'react'

import screens from '~screens/index'

/**
 * Universal React application launcher with automatic routing setup
 *
 * Bootstraps a React application with:
 * - React 18 concurrent rendering
 * - React Router DOM v6 integration
 * - Automatic screen/route mounting
 * - BrowserRouter configuration
 *
 * @example
 * ```tsx
 * import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'
 *
 * function App({ screen }) {
 *   return (
 *     <div className="app">
 *       <nav>Navigation</nav>
 *       <main>{screen}</main>
 *     </div>
 *   )
 * }
 *
 * new UniversalReactAppLauncher(App)
 * ```
 *
 * @remarks
 * Requires:
 * - `<div id="root"></div>` in HTML
 * - `~screens/index` module exporting RouteObject[]
 * - `~project/App` module
 */
export default class UniversalReactAppLauncher {
    /** Root DOM element for React app */
    readonly root: HTMLElement
    /** React 18 root instance */
    readonly reactRoot: Root

    /**
     * Creates and mounts React application
     *
     * @param App - Root component receiving screen prop
     * @throws Error if root element not found in DOM
     */
    constructor(App: FC<{ screen: ReactNode }>) {
        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalReactAppLauncher: root is missing')
        }

        this.root = root
        this.reactRoot = createRoot(this.root)
        this.reactRoot.render(
            <BrowserRouter>
                <AppRoot App={App} />
            </BrowserRouter>
        )
    }
}

/**
 * Internal component that connects routing to App component
 *
 * @param App - Root component to render with screen prop
 * @returns Rendered App with current route
 */
function AppRoot({ App }: { App: FC<{ screen: ReactNode }> }): ReactNode {
    const screen = useRoutes(screens)
    return <App screen={screen} />
}
