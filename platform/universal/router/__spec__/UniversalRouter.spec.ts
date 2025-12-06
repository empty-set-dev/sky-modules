/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { UniversalRouter, createRoutesFromScreens, type Route } from '../UniversalRouter'

import type JSX from 'sky-jsx'

// Mock components (simulating real JSX components)
const HomeComponent: JSX.FC = () => ({ tag: 'div', children: 'Home' }) as any
const AboutComponent: JSX.FC = () => ({ tag: 'div', children: 'About' }) as any
const UserComponent: JSX.FC = () => ({ tag: 'div', children: 'User' }) as any
const NotFoundComponent: JSX.FC = () => ({ tag: 'div', children: 'Not Found' }) as any

describe('UniversalRouter', () => {
    let mockWindow: typeof window

    beforeEach(() => {
        // Mock window object
        mockWindow = {
            location: { pathname: '/' },
            history: {
                pushState: vi.fn(),
            },
            addEventListener: vi.fn(),
        } as unknown as typeof window

        global.window = mockWindow
    })

    describe('Route Matching', () => {
        it('should match exact routes', async () => {
            const routes: Route[] = [
                { path: '/', Component: HomeComponent },
                { path: '/about', Component: AboutComponent },
            ]

            const router = new UniversalRouter(routes)
            await new Promise(resolve => setTimeout(resolve, 10))
            const match = router.getCurrentMatch()

            expect(match).not.toBeNull()
            expect(match?.path).toBe('/')
            expect(typeof match?.Component).toBe('function')
        })

        it('should match routes with parameters', async () => {
            const routes: Route[] = [{ path: '/users/:id', Component: UserComponent }]

            mockWindow.location.pathname = '/users/123'
            const router = new UniversalRouter(routes)
            await new Promise(resolve => setTimeout(resolve, 0))
            const match = router.getCurrentMatch()

            expect(match).not.toBeNull()
            expect(match?.path).toBe('/users/:id')
            expect(match?.params.id).toBe('123')
        })

        it('should return null when no route matches and no 404 handler', async () => {
            const routes: Route[] = [{ path: '/', Component: HomeComponent }]

            mockWindow.location.pathname = '/unknown'
            const router = new UniversalRouter(routes)
            const match = router.getCurrentMatch()

            expect(match).toBeNull()
        })

        it('should return 404 component when no route matches', async () => {
            const routes: Route[] = [{ path: '/', Component: HomeComponent }]

            mockWindow.location.pathname = '/unknown'
            const router = new UniversalRouter(routes, { notFound: NotFoundComponent })

            await new Promise(resolve => setTimeout(resolve, 10))
            const match = router.getCurrentMatch()

            expect(match).not.toBeNull()
            expect(typeof match?.Component).toBe('function')
            expect(match?.path).toBe('/unknown')
        })
    })

    describe('Navigation', () => {
        it('should navigate to new path', () => {
            const routes: Route[] = [
                { path: '/', Component: HomeComponent },
                { path: '/about', Component: AboutComponent },
            ]

            const router = new UniversalRouter(routes)
            router.navigate('/about')

            expect(mockWindow.history.pushState).toHaveBeenCalledWith({}, '', '/about')
        })

        it('should notify listeners on navigation', async () => {
            const routes: Route[] = [
                { path: '/', Component: HomeComponent },
                { path: '/about', Component: AboutComponent },
            ]

            const router = new UniversalRouter(routes)
            const listener = vi.fn()
            router.subscribe(listener)

            router.navigate('/about')
            await new Promise(resolve => setTimeout(resolve, 0))

            expect(listener).toHaveBeenCalled()
        })
    })

    describe('Subscription', () => {
        it('should call listener on route change', async () => {
            const routes: Route[] = [{ path: '/', Component: HomeComponent }]
            const router = new UniversalRouter(routes)
            const listener = vi.fn()

            router.subscribe(listener)
            router.navigate('/')
            await new Promise(resolve => setTimeout(resolve, 0))

            expect(listener).toHaveBeenCalled()
        })

        it('should unsubscribe listener', async () => {
            const routes: Route[] = [{ path: '/', Component: HomeComponent }]
            const router = new UniversalRouter(routes)
            const listener = vi.fn()

            const unsubscribe = router.subscribe(listener)
            unsubscribe()

            router.navigate('/')
            await new Promise(resolve => setTimeout(resolve, 0))

            expect(listener).not.toHaveBeenCalled()
        })
    })
})

describe('createRoutesFromScreens', () => {
    it('should convert index file to root route', () => {
        const screens = {
            './index.tsx': { default: HomeComponent },
        }

        const routes = createRoutesFromScreens(screens)

        expect(routes).toHaveLength(1)
        expect(routes[0].path).toBe('/')
        expect(routes[0].Component).toBe(HomeComponent)
    })

    it('should convert regular files to routes', () => {
        const screens = {
            './about.tsx': { default: AboutComponent },
        }

        const routes = createRoutesFromScreens(screens)

        expect(routes).toHaveLength(1)
        expect(routes[0].path).toBe('/about')
    })

    it('should convert dynamic routes with brackets to params', () => {
        const screens = {
            './users/[id].tsx': { default: UserComponent },
        }

        const routes = createRoutesFromScreens(screens)

        expect(routes).toHaveLength(1)
        expect(routes[0].path).toBe('/users/:id')
    })

    it('should handle nested index files', () => {
        const screens = {
            './users/index.tsx': { default: UserComponent },
        }

        const routes = createRoutesFromScreens(screens)

        expect(routes).toHaveLength(1)
        expect(routes[0].path).toBe('/users')
    })

    it('should sort routes by specificity', () => {
        const screens = {
            './index.tsx': { default: HomeComponent },
            './users/[id].tsx': { default: UserComponent },
            './about.tsx': { default: AboutComponent },
            './users/admin.tsx': { default: UserComponent },
        }

        const routes = createRoutesFromScreens(screens)

        // Static routes should come before dynamic routes
        // Longer paths should come before shorter paths
        const paths = routes.map(r => r.path)

        // Verify static routes come before dynamic
        const staticRoutes = paths.filter(p => !p.includes(':'))
        const dynamicRoutes = paths.filter(p => p.includes(':'))

        expect(staticRoutes).toEqual(['/users/admin', '/', '/about'])
        expect(dynamicRoutes).toEqual(['/users/:id'])

        // First route should be the most specific static route
        expect(paths[0]).toBe('/users/admin')
    })
})
