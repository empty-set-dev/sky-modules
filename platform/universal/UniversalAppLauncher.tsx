import { singleton, container } from '@sky-modules/core/DI'
import { FC } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import App from '#universal/App'
import routes from '~react-pages'

export type UniversalApp = FC

export function assertIsUniversalApp(app: unknown): asserts app is UniversalApp {
    if (typeof app !== 'function') {
        throw new Error('assertIsUniversalReactApp: App is not a function')
    }
}

@singleton()
export default class assertIsUniversalReactAppLauncher {
    static {
        container.resolve(assertIsUniversalReactAppLauncher)
    }

    readonly root: HTMLElement
    readonly reactRoot: Root

    constructor() {
        assertIsUniversalApp(App)

        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalAppLauncher: root is missing')
        }

        this.root = root

        this.reactRoot = createRoot(root)
        this.reactRoot.render(
            <BrowserRouter>
                <Root />
            </BrowserRouter>
        )
    }
}

function Root(): ReactNode {
    const screen = useRoutes(routes)
    return <App screen={screen} />
}
