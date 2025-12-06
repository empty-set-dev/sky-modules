import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import RuntimeInternal from '../../runtime/Internal'

// Initialize runtime
RuntimeInternal.isRuntime = true

import { describe, test } from 'vitest'
import { expectDefineRegistrations } from '../../../cli/test-utils'

import Internal from '../../define/internal/internal'
import { fire, task, handleAsyncError } from '../async'

describe('async module - define registrations', () => {
    test('should register all async utilities with define', () => {
        expectDefineRegistrations(Internal, [
            {
                uid: 'sky.core.fire',
                value: fire,
                type: 'func',
                name: 'fire',
            },
            {
                uid: 'sky.core.task',
                value: task,
                type: 'func',
                name: 'task',
            },
            {
                uid: 'sky.core.handleAsyncError',
                value: handleAsyncError,
                type: 'func',
                name: 'handleAsyncError',
            },
        ])
    })
})
