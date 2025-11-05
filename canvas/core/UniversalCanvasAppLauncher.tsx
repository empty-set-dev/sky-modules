import '@sky-modules/platform'
import { createRoutesFromScreens, UniversalRouter } from '@sky-modules/platform/universal/router'
import { JSX } from 'sky-jsx'

import { CanvasJSXRenderer } from '../jsx/jsx'

import screens from '~screens/index'

export default class UniversalCanvasAppLauncher {
    readonly root: HTMLElement
    private router: UniversalRouter | null = null
    private renderer: CanvasJSXRenderer
    private App: JSX.FC<{ screen: JSX.Element }>

    constructor(App: JSX.FC<{ screen: JSX.Element }>) {
        const root = document.getElementById('root')

        if (root == null) {
            throw new Error('UniversalCanvasAppLauncher: root element is missing')
        }

        this.root = root
        this.App = App
        this.renderer = new CanvasJSXRenderer({
            container: this.root,
            size: () => [window.innerWidth, window.innerHeight],
        })
        this.initializeRouter()
        this.renderCurrentScreen()

        window.addEventListener('resize', () => {
            this.renderer.canvas.domElement.width =
                window.innerWidth * this.renderer.canvas.pixelRatio
            this.renderer.canvas.domElement.height =
                window.innerHeight * this.renderer.canvas.pixelRatio
        })
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
        if (!this.router) {
            return
        }

        const match = this.router.getCurrentMatch()

        if (match) {
            const Screen = match.Component
            const App = this.App

            // Pass a function that creates elements - will be called reactively
            this.renderer.render(<App screen={<Screen />} />)
        }
    }
}
