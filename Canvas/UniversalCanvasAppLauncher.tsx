import '@sky-modules/platform'
import { createRoutesFromScreens, UniversalRouter } from '@sky-modules/platform/universal/router'
import { JSX } from 'sky-jsx'

import { CanvasJSXRenderer } from './jsx'

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
    }

    private initializeRouter(): void {
        console.log('Screens from vite-plugin-pages:', screens)
        console.log('Screens is array?', Array.isArray(screens))
        console.log('Screens length:', screens?.length)
        if (Array.isArray(screens) && screens.length > 0) {
            console.log('First screen:', screens[0])
            console.log('First screen keys:', Object.keys(screens[0]))
            console.log('First screen.component:', screens[0].component)
            console.log('First screen.component type:', typeof screens[0].component)
        }
        const routes = createRoutesFromScreens(screens)
        console.log('Routes created:', routes)
        if (routes.length > 0) {
            console.log('First route:', routes[0])
            console.log('First route.Component:', routes[0].Component)
            console.log('First route.Component type:', typeof routes[0].Component)
        }

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

            console.log('Screen component:', Screen)
            console.log('Screen type:', typeof Screen)
            console.log('App component:', App)

            // Pass a function that creates elements - will be called reactively
            this.renderer.render(<App screen={<Screen />} />)
        }
    }
}
