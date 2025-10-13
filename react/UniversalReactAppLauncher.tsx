import { singleton, container } from '@sky-modules/core/DI'
import { FC } from 'react'
import { createRoot, Root } from 'react-dom/client'

import App from '#/App'

export type UniversalReactApp = FC

export function assertIsUniversalReactApp(app: unknown): asserts app is UniversalReactApp {
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
        assertIsUniversalReactApp(App)

        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalReactAppService: root is missing')
        }

        this.root = root

        this.reactRoot = createRoot(root)
        this.reactRoot.render(<App />)
    }
}
