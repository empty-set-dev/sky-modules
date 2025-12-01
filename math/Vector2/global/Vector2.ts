/**
 * Global Vector2 class extension
 *
 * Makes Vector2 available globally by extending the default Vector2 class from Three.js math library.
 * This allows using Vector2 without explicit imports in the global scope.
 *
 * @example Basic usage
 * ```typescript
 * import '@sky-modules/math/Vector2/global'
 *
 * const vec = new Vector2(10, 20)
 * console.log(vec.x, vec.y) // 10, 20
 * ```
 *
 * @example Vector operations
 * ```typescript
 * const v1 = new Vector2(3, 4)
 * const v2 = new Vector2(1, 2)
 * v1.add(v2) // v1 is now (4, 6)
 * const length = v1.length() // 7.211...
 * ```
 */
import globalify from '@sky-modules/core/globalify'

import * as lib from '.'

globalify({ Vector2: lib.default })

declare global {
    class Vector2 extends lib.default {}
}
