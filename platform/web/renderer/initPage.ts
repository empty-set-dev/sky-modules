import { TFunction } from 'i18next'
import { dehydrate, QueryClient } from 'pkgs/@tanstack/react-query'
// import loadTranslationResources from 'sky/platform/web/i18n/loadTranslationResources'
import Console from 'sky/core/Console'
import { PageContext } from 'vike/types'

export interface InitPageParameters {
    ns: string[]
    theme?: string
}
export interface InitPageResult {
    domain: string
    lng: string
    lngPrefix: string
    t: TFunction
    queryClient: QueryClient
    ip: string
}
export default async function initPage(
    this: PageContext,
    parameters: InitPageParameters
): Promise<InitPageResult> {
    const store = {} as Store

    const { ns, theme } = parameters

    const forwarded = this.headers!['x-forwarded-for']

    const ip =
        import.meta.env.VITE_USER_IP ??
        (forwarded ? forwarded.split(/, /)[0] : (this.headers!['x-remote-address'] ?? '127.0.0.1'))

    const queryClient = new QueryClient()

    const lng = this.lng
    const lngPrefix = this.lngPrefix

    Console.log(`ip ${ip} -> ${this.urlOriginal}`)

    const dehydratedState = dehydrate(queryClient)

    // const [t, resources] = await loadTranslationResources(lng, ns)
    // this.theme = theme
    // this.t = t
    this.queryClient = queryClient
    this.initial = {
        store,
        dehydratedState,
        ip,
        ns,
        // resources,
    } as PageContext['initial']

    return {
        domain: this.domain,
        lng,
        lngPrefix,
        // t,
        queryClient,
        ip,
    }
}
