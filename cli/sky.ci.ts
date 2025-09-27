#!/usr/bin/env tsx

import doc from './doc.ci.ts'

const command = process.argv[2]

if (command === 'doc') {
    await doc()
}
