import { CanvasJSXRenderer } from './jsx'
import { createRoutesFromScreens, UniversalRouter } from '@sky-modules/platform/universal/router'

export default class UniversalCanvasAppLauncher {
    readonly root: HTMLElement
    private router: UniversalRouter | null = null
    private renderer: CanvasJSXRenderer

    constructor(App: () => unknown) {
        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalCanvasAppLauncher: root element is missing')
        }

        this.root = root
        this.renderer = new CanvasJSXRenderer(this.root)

        // Initialize router with screens
        this.initializeRouter().then(() => {
            // Render initial screen
            this.renderCurrentScreen()
        })
    }

    private async initializeRouter(): Promise<void> {
        // @ts-expect-error - dynamic import
        const screens = await import('~screens')
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
            // Render screen component using Canvas JSX renderer
            this.renderer.render(Screen())
        }
    }
}
