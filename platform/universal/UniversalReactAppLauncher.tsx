import { CanvasJSXRenderer } from '@sky-modules/canvas/jsx'
import { singleton, container } from '@sky-modules/core/DI'

import { UniversalRouter, createRoutesFromScreens } from './router'

import type { FC, ReactNode } from 'react'

import App from '#universal/App'

export type UniversalApp = FC

export function assertIsUniversalApp(app: unknown): asserts app is UniversalApp {
    if (typeof app !== 'function') {
        throw new Error('assertIsUniversalReactApp: App is not a function')
    }
}

interface UniversalAppLauncherParameters {
    renderer: 'canvas' | 'three' | 'react'
}

@singleton()
export default class UniversalAppLauncher {
    static {
        container.resolve(UniversalAppLauncher)
    }

    readonly root: HTMLElement
    private router: UniversalRouter | null = null

    constructor(parameters: UniversalAppLauncherParameters) {
        assertIsUniversalApp(App)

        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalAppLauncher: root is missing')
        }

        this.root = root

        if (parameters.renderer === 'canvas') {
            fire(this.__launchCanvasApp)
        } else if (parameters.renderer === 'three') {
            fire(this.__launchThreeApp)
        } else if (parameters.renderer === 'react') {
            fire(this.__lauchReactApp)
        }
    }

    private async __lauchReactApp(): Promise<void> {
        const { createRoot } = await import('react-dom/client')
        const { BrowserRouter, useRoutes } = await import('react-router-dom')

        // @ts-expect-error pages
        const routes = (await import('~screens')).default

        function Root(): ReactNode {
            const screen = useRoutes(routes)

            return <App screen={screen} />
        }

        const reactRoot = createRoot(this.root)

        reactRoot.render(
            <BrowserRouter>
                <Root />
            </BrowserRouter>
        )
    }
}
