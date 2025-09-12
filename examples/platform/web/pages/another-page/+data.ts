import { PageContextServer } from 'vike/types'

import { onTest } from './AnotherPage.telefunc'

// import { onTest } from './AnotherPage.telefunc'

export async function data(pageContext: PageContextServer): number {
    console.log('ANOTHER DATA')
    await idle((1).seconds)
    await onTest(42)

    return 42
}
