/**
 * Global Vector3 class extension
 *
 * Makes Vector3 available globally by extending the default Vector3 class from Three.js math library.
 * This allows using Vector3 without explicit imports in the global scope.
 *
 * @example Basic usage
 * ```typescript
 * import '@sky-modules/math/Vector3/global'
 *
 * const vec = new Vector3(10, 20, 30)
 * console.log(vec.x, vec.y, vec.z) // 10, 20, 30
 * ```
 *
 * @example Vector operations
 * ```typescript
 * const v1 = new Vector3(3, 4, 5)
 * const v2 = new Vector3(1, 2, 3)
 * v1.add(v2) // v1 is now (4, 6, 8)
 * const length = v1.length() // 10.77...
 * const normalized = v1.clone().normalize() // Unit vector
 * ```
 *
 * @example Cross product and dot product
 * ```typescript
 * const v1 = new Vector3(1, 0, 0)
 * const v2 = new Vector3(0, 1, 0)
 * const cross = v1.clone().cross(v2) // (0, 0, 1)
 * const dot = v1.dot(v2) // 0
 * ```
 */
import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ Vector3: lib.default })

declare global {
    class Vector3 extends lib.default {}
}
