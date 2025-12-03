import globalify from '@sky-modules/core/globalify'

import * as imports from '../UniversalRouter'

declare global {
    const createRoutesFromScreens: typeof imports.createRoutesFromScreens
    const UniversalRouter: typeof imports.UniversalRouter
    type RouteMatch = imports.RouteMatch
    type Route = imports.Route
    type ScreenModule = imports.ScreenModule
    type VitePageRoute = imports.VitePageRoute
}

globalify({ ...imports })
