import { useEffect, useState } from 'react'
import { createRoot, Root } from 'react-dom/client'

import { createRoutesFromScreens, UniversalRouter } from './router'

import type { FC, ReactNode } from 'react'

// @ts-expect-error import screens
import screens from '~screens'

export default class UniversalCanvasAppLauncher {
    readonly root: HTMLElement
    readonly reactRoot: Root
    private router: UniversalRouter

    constructor(App: FC<{ screen: ReactNode }>) {
        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalCanvasAppLauncher: root is missing')
        }

        this.root = root

        // Convert screens to routes and create router
        const routes = createRoutesFromScreens(screens)
        this.router = new UniversalRouter(routes)

        // Create React root and render with routing
        this.reactRoot = createRoot(this.root)
        this.reactRoot.render(<RouterRoot App={App} router={this.router} />)
    }
}

function RouterRoot({
    App,
    router,
}: {
    App: FC<{ screen: ReactNode }>
    router: UniversalRouter
}): ReactNode {
    const [currentMatch, setCurrentMatch] = useState(router.getCurrentMatch())

    // Subscribe to route changes
    useEffect(() => {
        const unsubscribe = router.subscribe(match => {
            setCurrentMatch(match)
        })

        return unsubscribe
    }, [router])

    // Render current screen component
    const screen = currentMatch ? <currentMatch.Component /> : null

    return <App screen={screen} />
}
