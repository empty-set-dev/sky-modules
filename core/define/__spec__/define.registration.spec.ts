import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import RuntimeInternal from '../../runtime/Internal'

// Initialize runtime
RuntimeInternal.isRuntime = true

import { describe, test } from 'vitest'
import { expectDefineRegistrations } from '../../../cli/test-utils'

import Internal from '../internal/internal'
import define from '../define'
import schema from '../schema'
import plain from '../plain'
import save from '../save'
import loadDefines from '../loadDefines'

describe('define module - define registrations', () => {
    test('should register all define utilities with define', () => {
        expectDefineRegistrations(Internal, [
            {
                uid: 'sky.core.define',
                value: define,
                type: 'func',
                name: 'define',
            },
            {
                uid: 'sky.core.schema',
                value: schema,
                type: 'func',
                name: 'schema',
            },
            {
                uid: 'sky.core.plain',
                value: plain,
                type: 'func',
                name: 'plain',
            },
            {
                uid: 'sky.core.save',
                value: save,
                type: 'func',
                name: 'save',
            },
            {
                uid: 'sky.core.loadDefines',
                value: loadDefines,
                type: 'func',
                name: 'loadDefines',
            },
        ])
    })
})
