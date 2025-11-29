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
    private fpsDisplay: HTMLDivElement
    private fpsCounter = 0
    private lastFpsUpdate = 0
    private currentFps = 0

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

        // Create FPS display
        this.fpsDisplay = document.createElement('div')
        this.fpsDisplay.style.position = 'absolute'
        this.fpsDisplay.style.top = '0'
        this.fpsDisplay.style.left = '0'
        this.fpsDisplay.style.padding = '8px'
        this.fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
        this.fpsDisplay.style.color = 'white'
        this.fpsDisplay.style.fontFamily = 'monospace'
        this.fpsDisplay.style.fontSize = '14px'
        this.fpsDisplay.style.zIndex = '1000'
        this.fpsDisplay.style.pointerEvents = 'none'
        this.fpsDisplay.textContent = 'FPS: 0'
        this.root.appendChild(this.fpsDisplay)

        this.initializeRouter()
        this.renderCurrentScreen()

        // Hook into renderer's animation loop for FPS counting
        const originalAnimate = this.renderer['animate'].bind(this.renderer)
        this.renderer['animate'] = () => {
            this.updateFps()
            originalAnimate()
        }

        window.addEventListener('resize', () => {
            // Resize canvas
            this.renderer.canvas.onResize()
            // Re-render with new window dimensions (this will recalculate layout)
            this.renderCurrentScreen()
        })
    }

    private updateFps(): void {
        const now = performance.now()
        this.fpsCounter++

        if (now - this.lastFpsUpdate >= 1000) {
            this.currentFps = Math.round((this.fpsCounter * 1000) / (now - this.lastFpsUpdate))
            this.fpsDisplay.textContent = `FPS: ${this.currentFps}`
            this.fpsCounter = 0
            this.lastFpsUpdate = now
        }
    }

    private initializeRouter(): void {
        const routes = createRoutesFromScreens(screens)

        // FIX: Add leading slash to paths that don't have it (except '/')
        routes.forEach(route => {
            if (route.path !== '/' && !route.path.startsWith('/')) {
                route.path = '/' + route.path
            }
        })

        this.router = new UniversalRouter(routes)

        // Listen to route changes
        this.router.subscribe(() => {
            this.renderCurrentScreen()
        })
    }

    private renderCurrentScreen(): void {
        if (!this.router) {
            console.log('[DEBUG] No router')
            return
        }

        const match = this.router.getCurrentMatch()
        console.log('[DEBUG] Route match:', match?.path, match?.Component?.name)

        if (match) {
            const Screen = match.Component
            const App = this.App

            // Pass a function that creates elements - will be called reactively
            const element = <App screen={<Screen />} />
            console.log('[DEBUG] Element to render:', element)
            this.renderer.render(element)
        }
    }
}
