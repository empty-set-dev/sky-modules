import globalify from '@sky-modules/core/globalify'

import Raycaster, * as imports from '../Raycaster'

declare global {
    const Raycaster: typeof imports.default
    type Raycaster = typeof imports.default
    type Ray = imports.Ray
    type Intersection = imports.Intersection
}

globalify({ Raycaster })
