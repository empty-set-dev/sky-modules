import { PageContextServer } from 'vike/types'

export default async function onBeforeRenderHtml(
    pageContext: PageContextServer,
    html: string
): Promise<string> {
    const asyncData = pageContext.config['async-data']

    if (asyncData && asyncData.length > 0) {
        const abortController = new AbortController()
        pageContext.data = (
            await Promise.all(
                asyncData.map(asyncData => asyncData(pageContext, abortController.signal))
            )
        ).reduce((data: object, currentData: object) => {
            return Object.assign(data, currentData)
        }, {})
    }

    return html
}
