import i18n, { Resource, TFunction } from '@pkgs/i18next'
import resourcesToBackend from '@pkgs/i18next-resources-to-backend'

export default async function loadTranslationResources(
    lng: string,
    ns: string[]
): Promise<[TFunction, Resource]> {
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

    return [i18nInstance.t, i18nInstance.services.resourceStore.data]
}
