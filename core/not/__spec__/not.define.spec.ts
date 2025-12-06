import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import RuntimeInternal from '../../runtime/Internal'

// Initialize runtime
RuntimeInternal.isRuntime = true

import { describe, test } from 'vitest'
import { expectDefineRegistrations } from '../../../cli/test-utils'

import Internal from '../../define/internal/internal'
import {
    notUndefined,
    assertIsNotUndefined,
    notNull,
    assertIsNotNull,
    notNullish,
    assertIsNotNullish,
} from '../not'

describe('not module - define registrations', () => {
    test('should register all not utilities with define', () => {
        expectDefineRegistrations(Internal, [
            {
                uid: 'sky.core.notUndefined',
                value: notUndefined,
                type: 'func',
                name: 'notUndefined',
            },
            {
                uid: 'sky.core.assertIsNotUndefined',
                value: assertIsNotUndefined,
                type: 'func',
                name: 'assertIsNotUndefined',
            },
            {
                uid: 'sky.core.notNull',
                value: notNull,
                type: 'func',
                name: 'notNull',
            },
            {
                uid: 'sky.core.assertIsNotNull',
                value: assertIsNotNull,
                type: 'func',
                name: 'assertIsNotNull',
            },
            {
                uid: 'sky.core.notNullish',
                value: notNullish,
                type: 'func',
                name: 'notNullish',
            },
            {
                uid: 'sky.core.assertIsNotNullish',
                value: assertIsNotNullish,
                type: 'func',
                name: 'assertIsNotNullish',
            },
        ])
    })
})
