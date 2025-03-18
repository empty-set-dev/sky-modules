import { dehydrate, QueryClient } from '@tanstack/react-query'
import { TFunction } from 'pkgs/i18next'
import { logConsole } from 'sky/helpers/console'
import loadTranslationResources from 'sky/platform/web/i18n/loadTranslationResources'
import { PageContext } from 'vike/types'

import Store from '../Store'

export interface InitPageOptions {
    ns: string[]
}
export interface InitPageResult {
    domain: string
    lng: string
    lngPrefix: string
    t: TFunction
    queryClient: QueryClient
    store: Store
    ip: string
}
export default async function initPage(
    this: PageContext,
    options: InitPageOptions
): Promise<InitPageResult> {
    const store = {} as Store

    const { ns } = options

    const forwarded = this.headers!['x-forwarded-for']

    const ip =
        import.meta.env.PUBLIC_ENV__USER_IP ??
        (forwarded ? forwarded.split(/, /)[0] : (this.headers!['x-remote-address'] ?? '127.0.0.1'))

    logConsole('ip', ip)

    const queryClient = new QueryClient()

    const lng = this.lng
    const lngPrefix = this.lngPrefix

    logConsole('lng and prefix', `"${lng}"`, `"${lngPrefix}"`)

    const dehydratedState = dehydrate(queryClient)

    const [t, resources] = await loadTranslationResources(lng, ns)
    this.t = t
    this.queryClient = queryClient
    this.initial = {
        store,
        dehydratedState,
        ip,
        ns,
        resources,
    } as PageContext['initial']

    return {
        domain: this.domain,
        lng,
        lngPrefix,
        t,
        queryClient,
        store,
        ip,
    }
}
