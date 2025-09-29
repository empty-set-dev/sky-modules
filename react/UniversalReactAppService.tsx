import { singleton, container } from '@sky-modules/core/DI'
import { FC } from 'react'
import { createRoot, Root } from 'react-dom/client'

import App from '#/App'

export interface UniversalReactApp {
    render: FC
}

export function assertIsUniversalReactApp(
    app: Partial<UniversalReactApp>
): asserts app is UniversalReactApp {
    if (typeof app.render !== 'function') {
        throw new Error('assertIsUniversalReactApp: render in App is not a function')
    }
}

@singleton()
export default class UniversalReactAppService {
    static {
        container.resolve(UniversalReactAppService)
    }

    readonly app = new App()
    readonly root: HTMLElement
    readonly reactRoot: Root

    constructor() {
        assertIsUniversalReactApp(this.app)

        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalReactAppService: root is missing')
        }

        this.root = root

        this.reactRoot = createRoot(root)
        this.reactRoot.render(<this.app.render />)
    }
}
