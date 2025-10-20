import { createRoutesFromScreens, UniversalRouter } from '@sky-modules/platform/universal/router'

import { CanvasJSXRenderer } from './jsx'

// @ts-expect-error - dynamic import
import screens from '~pages'

export default class UniversalCanvasAppLauncher {
    readonly root: HTMLElement
    private router: UniversalRouter | null = null
    private renderer: CanvasJSXRenderer
    private App: (props: { screen: unknown }) => unknown

    constructor(App: (props: { screen: unknown }) => unknown) {
        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalCanvasAppLauncher: root element is missing')
        }

        this.root = root
        this.App = App
        this.renderer = new CanvasJSXRenderer({ container: this.root })
        this.initializeRouter()
        this.renderCurrentScreen()
    }

    private initializeRouter(): void {
        const routes = createRoutesFromScreens(screens)

        this.router = new UniversalRouter(routes)

        // Listen to route changes
        this.router.subscribe(() => {
            this.renderCurrentScreen()
        })
    }

    private renderCurrentScreen(): void {
        if (!this.router) return

        const match = this.router.getCurrentMatch()

        if (match) {
            const Screen = match.Component
            // Wrap screen with App component and render using Canvas JSX renderer
            this.renderer.render(this.App({ screen: Screen() }))
        }
    }
}
