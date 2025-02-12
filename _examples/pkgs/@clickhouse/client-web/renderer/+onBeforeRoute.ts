import runsOnServerSide from 'sky/platform/web/runsOnServerSide'
import { logConsole } from 'sky/helpers/console'

import i18nConfig from '../i18n-config'

import routeData from './routeData'

import type { PageContext } from 'vike/types'

if (!runsOnServerSide) {
    window.global = window
}

global.afterHydration = true

export interface OnBeforeRouteResult {
    pageContext: {
        domain?: string
        lng?: string
        lngPrefix?: string
        urlLogical: string
    }
}
export default function onBeforeRoute(pageContext: PageContext): OnBeforeRouteResult {
    const { pathname } = pageContext.urlParsed

    if (!runsOnServerSide) {
        const { lng, lngPrefix, urlLogical } = getLogicalUrl(pathname, routeData.domain)

        return {
            pageContext: {
                lng,
                lngPrefix,
                urlLogical,
            },
        }
    }

    let domain!: string

    if (pageContext.headers?.host.startsWith('localhost:')) {
        domain = 'localhost'
    }

    if (import.meta.env.PUBLIC_ENV__DOMAIN) {
        domain = import.meta.env.PUBLIC_ENV__DOMAIN
    }

    if (!domain) {
        throw Error('domain not defined')
    }

    if (pageContext.headers!.accept !== '*/*') {
        logConsole('-> accept', domain, pathname)
    } else {
        logConsole('-> metadata', domain, pathname)
    }

    const { lng, lngPrefix, urlLogical } = getLogicalUrl(pathname, domain)

    return {
        pageContext: {
            domain,
            lng,
            lngPrefix,
            // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
            urlLogical,
        },
    }
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
