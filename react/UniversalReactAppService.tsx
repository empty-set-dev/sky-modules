import { FC } from 'react'
import { createRoot, Root } from 'react-dom/client'

import App from '#/App'
iAm('sky.react.UniversalReactAppService', import('./UniversalReactAppService'))

declare global {
    interface Modules {
        'sky.react.UniversalReactAppService': typeof import('./UniversalReactAppService')
    }
}

export interface UniversalReactApp {
    render: FC
}

export function assertIsUniversalReactApp(
    app: Partial<UniversalReactApp>
): asserts app is UniversalReactApp {
    if (app.render == null) {
        throw new Error('assertIsUniversalReactApp: no render in App')
    }
}

@Service
export default class UniversalReactAppService {
    @inject readonly app: UniversalReactApp
    readonly root: HTMLElement
    readonly reactRoot: Root

    constructor() {
        // TODO getService(App, assertIsUniversalReactApp)
        const app = getService(App)
        assertIsUniversalReactApp(app)
        this.app = app

        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalReactAppService: root is missing')
        }

        this.root = root

        this.reactRoot = createRoot(root)
        this.reactRoot.render(<app.render />)
    }
}
