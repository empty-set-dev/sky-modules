import { PageContextServer } from 'vike/types'

import { onTest } from './AnotherPage.telefunc'

export async function data(pageContext: PageContextServer): Promise<void> {
    console.log('ANOTHER DATA')
    await onTest(42)
}
