#!/usr/bin/env tsx
import __import from './__import'

const command = process.argv[2]

if (!__import(`/${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`command "${command}" not found`)
}
