import { PageContextServer } from 'vike/types'

import { onTest } from './AnotherPage.telefunc'

// import { onTest } from './AnotherPage.telefunc'

export async function data(pageContext: PageContextServer): number {
    return 42
}
