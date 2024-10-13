import { dehydrate, QueryClient } from '@tanstack/react-query'
import { logConsole } from 'sky/helpers/console'
import loadTranslationResources from 'sky/i18n/loadTranslationResources'
import { PageContext } from 'vike/types'

import Store from '../Store'

export interface InitServerOptions {
    ns: string[]
}
export default async function initPage(
    pageContext: PageContext,
    options: InitServerOptions
): Promise<PageContext['data']> {
    const store = {} as Store

    const { ns } = options

    const domain = pageContext.domain

    const forwarded = pageContext.headers!['x-forwarded-for']

    const ip =
        import.meta.env.PUBLIC_ENV__USER_IP ??
        (forwarded
            ? forwarded.split(/, /)[0]
            : pageContext.headers!['x-remote-address'] ?? '127.0.0.1')

    logConsole('ip', ip)

    const client = new QueryClient()

    const lng = pageContext.lng
    const lngPrefix = pageContext.lngPrefix

    logConsole('lng and prefix', `"${lng}"`, `"${lngPrefix}"`)

    const urlLogical = pageContext.urlLogical

    const dehydratedState = dehydrate(client)

    const resources = await loadTranslationResources(lng, ns)

    Object.assign(pageContext, {
        client,
        preloads: [],
    })

    return {
        domain,
        lng,
        lngPrefix,
        urlLogical,
        store,
        dehydratedState,
        ns,
        resources,
        ip,
    }
}
