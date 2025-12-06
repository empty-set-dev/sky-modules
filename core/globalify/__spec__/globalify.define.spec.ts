import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import RuntimeInternal from '../../runtime/Internal'

// Initialize runtime
RuntimeInternal.isRuntime = true

import { describe, test } from 'vitest'
import { expectDefineRegistrations } from '../../../cli/test-utils'

// Import triggers registration
import globalify from '../globalify'
import Internal from '../../define/internal/internal'

describe('globalify module - define registrations', () => {
    test('should register globalify and namespace with define', () => {
        expectDefineRegistrations(Internal, [
            {
                uid: 'sky.core.globalify',
                value: globalify,
                type: 'func',
                name: 'globalify',
            },
            {
                uid: 'sky.core.globalify.namespace',
                value: globalify.namespace,
                type: 'func',
                name: 'namespace',
            },
        ])
    })
})
