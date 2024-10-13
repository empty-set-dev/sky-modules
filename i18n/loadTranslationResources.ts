import i18n, { Resource } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

export default async function loadTranslationResources(
    lng: string,
    ns: string[]
): Promise<Resource> {
    const i18nInstance = i18n.createInstance()

    await i18nInstance
        .use(
            resourcesToBackend((language: string, namespace: string) => {
                return import(`#/locales/${language}/${namespace}.js`).then(
                    result => result.default
                )
            })
        )
        .init({
            supportedLngs: [lng],
            fallbackLng: 'en',
            fallbackNS: 'common',
            defaultNS: 'common',
            ns: ['common', ...ns],
            lng,
            preload: [],
        })

    return i18nInstance.services.resourceStore.data
}
