#!/usr/bin/env tsx

import doc from './doc.ci'

const command = process.argv[2]

if (command === 'doc') {
    await doc()
}
