import { PageContextServer } from 'vike/types'

import { onTest } from './HomePage.telefunc'

export default async function data(pageContext: PageContextServer): Promise<void> {
    // console.log('DATA')
    // await onTest(42)
    await idle((2).seconds)
    return 42
}
