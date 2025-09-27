#!/usr/bin/env tsx

import doc from './doc.ci.js'

const command = process.argv[2]

if (command === 'doc') {
    await doc()
}
