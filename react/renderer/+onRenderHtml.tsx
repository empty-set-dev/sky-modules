import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { PageContextServer } from 'vike/types'

export default async function onRenderHtml(pageContext: PageContextServer): Promise<{
    documentHtml: ReturnType<typeof escapeInject>
    pageContext: {}
}> {
    const stream = await renderToStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {/* <link rel="icon" href={logoUrl} /> */}
                <title>EmptySet</title>
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>
    )

    console.log(stream.hasStreamEnded())

    const documentHtml = escapeInject`<!DOCTYPE html>${stream}`

    return {
        documentHtml,
        pageContext: {
            // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
        },
    }
}
