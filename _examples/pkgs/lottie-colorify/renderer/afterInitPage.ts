import { dehydrate } from '@tanstack/react-query'
import { PageContext } from 'vike/types'

export default async function afterInitPage(this: PageContext): Promise<void> {
    this.initial.dehydratedState = dehydrate(this.client)
}
