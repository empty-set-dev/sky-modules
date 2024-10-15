import i18n, { Resource } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import runsOnServerSide from 'sky/@platform/web/helpers/runsOnServerSide'
import { logConsole } from 'sky/helpers/console'

let clientInstance: typeof i18n
let firstInstance = true
interface TranslationsProvider extends PropsWithChildren {
    lng: string
    ns: string[]
    resources: Resource
}
function TranslationsProvider({ lng, ns, resources, children }: TranslationsProvider): ReactNode {
    if (!runsOnServerSide && clientInstance && firstInstance) {
        firstInstance = false

        clientInstance = i18n.createInstance()
        clientInstance
            .use(initReactI18next)
            .use(
                resourcesToBackend((language: string, namespace: string) => {
                    logConsole('load', `locales/${language}/${namespace}.json`)
                    return import(`#/locales/${language}/${namespace}.js`).then(
                        result => result.default
                    )
                })
            )
            .init({
                fallbackLng: 'en',
                fallbackNS: 'common',
                defaultNS: 'common',
                ns: ['common', ...ns],
                lng,
                preload: [],
                debug: false,
            })
    }

    const i18nInstance = useMemo(() => {
        if (!runsOnServerSide && clientInstance) {
            return clientInstance
        }

        const i18nInstance = i18n.createInstance()

        if (!runsOnServerSide) {
            clientInstance = i18nInstance
        }

        i18nInstance.use(initReactI18next).init({
            fallbackLng: 'en',
            fallbackNS: 'common',
            defaultNS: 'common',
            ns: ['common', ...ns],
            lng,
            preload: [],
            resources,
            debug: false,
        })
        return i18nInstance
    }, [runsOnServerSide || firstInstance])

    if (i18nInstance.language !== lng) {
        i18nInstance.changeLanguage(lng)
    }

    return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

export default TranslationsProvider
