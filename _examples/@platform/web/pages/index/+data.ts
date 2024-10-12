import initPage from 'renderer/initPage'
import { PageContext } from 'vike/types'

export default async function data(pageContext: PageContext): Promise<PageContext['data']> {
    const data = await initPage(pageContext, {
        ns: [],
    })

    return data
}
