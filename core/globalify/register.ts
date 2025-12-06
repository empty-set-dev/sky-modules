/**
 * Registers globalify in the define system
 *
 * This file is separate from globalify.ts to avoid circular dependencies:
 * - globalify.ts MUST NOT import define (to stay dependency-free)
 * - define/global/define.ts imports globalify
 * - This file imports both and registers globalify
 */

import define from '../define/define'
import globalify from './globalify'

// Register globalify and its namespace function
define('sky.core.globalify', globalify)
define('sky.core.globalify.namespace', globalify.namespace)
