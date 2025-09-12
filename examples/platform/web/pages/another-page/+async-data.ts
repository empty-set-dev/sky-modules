import { PageContextServer } from 'vike/types'

import { onTest } from './AnotherPage.telefunc'
// import { onTest } from './AnotherPage.telefunc'

export default async function data(
    pageContext: PageContextServer
): Promise<{ x: number; a: string; b: string; c: string }> {
    return onTest(42)
}
