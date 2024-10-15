export { onBeforeRoute }

import runsOnServerSide from 'sky/@platform/web/helpers/runsOnServerSide'
import { logConsole } from 'sky/helpers/console'
import { modifyUrl } from 'vike/modifyUrl'

import i18nConfig from '../i18n-config'

import type { PageContext } from 'vike/types'

interface OnBeforeRouteResult {
    pageContext: {
        domain?: string
        lng?: string
        lngPrefix?: string
        urlLogical?: string
    }
}
function onBeforeRoute(pageContext: PageContext): OnBeforeRouteResult {
    if (!runsOnServerSide) {
        return {
            pageContext: {},
        }
    }

    const { pathname } = pageContext.urlParsed

    let domain!: string
    let lng!: string
    let lngPrefix: string = ''

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

    let logicalPathname = pathname

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

    logicalPathname = lngPrefix !== '' ? pathname.slice(3) : pathname

    if (logicalPathname === '') {
        logicalPathname = '/'
    }

    const urlLogical = modifyUrl(pageContext.urlParsed.href, { pathname: logicalPathname })

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
