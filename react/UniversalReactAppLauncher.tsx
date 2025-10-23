import {} from '@sky-modules/platform'

import '~project/App'

import { createRoot, Root } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import type { FC, ReactNode } from 'react'

import screens from '~screens/index'

export default class UniversalReactAppLauncher {
    readonly root: HTMLElement
    readonly reactRoot: Root

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

function AppRoot({ App }: { App: FC<{ screen: ReactNode }> }): ReactNode {
    const screen = useRoutes(screens)
    return <App screen={screen} />
}
