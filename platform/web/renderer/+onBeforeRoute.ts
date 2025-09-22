import { runsOnClientSide } from 'sky/platform/runsOnSide'
import Console from 'sky/standard/Console'
// import globalify from 'sky/standard/globalify'

import i18nConfig from '#/i18n-config'
import routeData from '../../../examples/react/old-render/routeData'

import type { PageContext } from 'vike/types'

// import '#/App'

// globalify({ afterHydration: false })

export interface OnBeforeRouteResult {
    pageContext: {
        // domain?: string
        // lng?: string
        // lngPrefix?: string
        urlLogical: string
    }
}
export default function onBeforeRoute(pageContext: PageContext): OnBeforeRouteResult {
    const { pathname } = pageContext.urlParsed


    // if (runsOnClientSide) {
    //     const domain = routeData.domain ?? getDomain(pageContext)

    //     const { lng, lngPrefix, urlLogical } = getLogicalUrl(pathname, domain)

    //     return {
    //         pageContext: {
    //             lng,
    //             lngPrefix,
    //             urlLogical,
    //         },
    //     }
    // }

    // const domain = getDomain(pageContext)

    // if (pageContext.headers!.accept !== '*/*') {
    //     Console.log('-> accept', domain, pathname)
    // } else {
    //     Console.log('-> metadata', domain, pathname)
    // }

    // const { lng, lngPrefix, urlLogical } = getLogicalUrl(pathname, domain)

    const urlLogical = pathname

    return {
        pageContext: {
            // domain,
            // lng,
            // lngPrefix,
            // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
            urlLogical,
        },
    }
}

function getDomain(pageContext: PageContext): string {
    let domain: null | string = null

    if (pageContext.headers?.host.startsWith('localhost:')) {
        domain = 'localhost'
    }

    if (import.meta.env.VITE_DOMAIN) {
        domain = import.meta.env.VITE_DOMAIN
    }

    if (domain == null) {
        throw new Error('domain not defined')
    }

    return domain
}

function getLogicalUrl(
    pathname: string,
    domain: string
): {
    lng: string
    lngPrefix: string
    urlLogical: string
} {
    let lng!: string
    let lngPrefix = ''
    let urlLogical = pathname

    Object.keys(i18nConfig).forEach(subDomain => {
        if (!domain.endsWith(`.${subDomain}`) && !domain.startsWith(`${subDomain}.`)) {
            return
        }

        const additionalLanguages = i18nConfig[subDomain as keyof typeof i18nConfig].languages

        additionalLanguages.forEach(language => {
            if (pathname.startsWith(`/${language}`)) {
                lng = pathname.slice(1, 3)
                lngPrefix = pathname.slice(0, 3)
            }
        })
    })

    if (!lng) {
        Object.keys(i18nConfig).some(subDomain => {
            if (subDomain === 'localhost' && domain === 'localhost') {
                lng = i18nConfig[subDomain as keyof typeof i18nConfig].defaultLanguage
                return true
            }

            if (!domain.endsWith(`.${subDomain}`) && !domain.startsWith(`${subDomain}.`)) {
                return false
            }

            lng = i18nConfig[subDomain as keyof typeof i18nConfig].defaultLanguage
            return true
        })
    }

    if (!lng) {
        Object.keys(i18nConfig).some(subDomain => {
            const { defaultLanguage } = i18nConfig[subDomain as keyof typeof i18nConfig]
            if (
                !domain.endsWith(`.${defaultLanguage}`) &&
                !domain.startsWith(`${defaultLanguage}.`)
            ) {
                return false
            }

            lng = defaultLanguage
            return true
        })
    }

    urlLogical = lngPrefix !== '' ? pathname.slice(3) : pathname

    if (urlLogical === '') {
        urlLogical = '/'
    }

    return {
        lng,
        lngPrefix,
        urlLogical,
    }
}
