import i18n, { Resource } from 'pkgs/i18next'
import resourcesToBackend from 'pkgs/i18next-resources-to-backend'
import { I18nextProvider, initReactI18next } from 'pkgs/react-i18next'
import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'
import Console from 'sky/utilities/Console'

let clientInstance: typeof i18n
let firstInstance = true

export interface TranslationsProviderProps extends PropsWithChildren {
    lng: string
    ns: string[]
    resources: Resource
}
export default function TranslationsProvider({
    lng,
    ns,
    resources,
    children,
}: TranslationsProviderProps): ReactNode {
    if (!runsOnServerSide && clientInstance && firstInstance) {
        firstInstance = false

        clientInstance = i18n.createInstance()
        async(
            clientInstance.use(initReactI18next).use(
                resourcesToBackend((language: string, namespace: string) => {
                    Console.log('load', `locales/${language}/${namespace}.json`)
                    return import(`#/locales/${language}/${namespace}.js`).then(
                        result => result.default
                    )
                })
            ).init,
            {
                fallbackLng: 'en',
                fallbackNS: 'common',
                defaultNS: 'common',
                ns: ['common', ...ns],
                lng,
                preload: [],
                debug: false,
            }
        )
    }

    const i18nInstance = useMemo(() => {
        if (!runsOnServerSide && clientInstance) {
            return clientInstance
        }

        const i18nInstance = i18n.createInstance()

        if (!runsOnServerSide) {
            clientInstance = i18nInstance
        }

        async(i18nInstance.use(initReactI18next).init, {
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
        async(i18nInstance.changeLanguage, lng)
    }

    return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
