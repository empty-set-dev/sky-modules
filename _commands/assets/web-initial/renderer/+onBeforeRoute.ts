export { onBeforeRoute }

import runsOnServerSide from '@platform/web/helpers/runsOnServerSide'
import { logConsole } from 'sky/helpers/console'
import { modifyUrl } from 'vike/modifyUrl'

import i18nConfig from '../i18n-config'

import currentPageContextClientData from './currentPageContextClientData'

import type { PageContext } from 'vike/types'

interface OnBeforeRouteResult {
    pageContext: {
        domain?: string
        lng?: string
        lngPrefix?: string
        urlLogical: string
    }
}
function onBeforeRoute(pageContext: PageContext): OnBeforeRouteResult {
    const { pathname } = pageContext.urlParsed

    if (!runsOnServerSide) {
        const { lngPrefix } = currentPageContextClientData.data

        let logicalPathname = lngPrefix !== '' ? pathname.slice(3) : pathname

        if (logicalPathname === '') {
            logicalPathname = '/'
        }

        currentPageContextClientData.data.urlLogical = logicalPathname

        return {
            pageContext: {
                urlLogical: logicalPathname,
            },
        }
    }

    let domain!: string
    let lng!: string
    let lngPrefix: string = ''

    if (pageContext.headers?.host == 'localhost:3000') {
        domain = pageContext.headers!.host
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

    Object.keys(i18nConfig.additionalLanguages).forEach(domainPostfix => {
        if (
            !domain.endsWith(`.${domainPostfix}`) &&
            !domain.startsWith(`${domainPostfix}.`) &&
            !domain.startsWith(`next${domainPostfix}.`)
        ) {
            return
        }

        const additionalLanguages = i18nConfig.additionalLanguages[
            domainPostfix as keyof typeof i18nConfig.additionalLanguages
        ] as string[]

        additionalLanguages.forEach(language => {
            if (pathname.startsWith(`/${language}`)) {
                lng = pathname.slice(1, 3)
                lngPrefix = pathname.slice(0, 3)
            }
        })
    })

    if (!lng) {
        i18nConfig.domains.some((domainPostfix, i) => {
            if (
                !domain.endsWith(`.${domainPostfix}`) &&
                !domain.startsWith(`${domainPostfix}.`) &&
                !domain.startsWith(`next${domainPostfix}.`)
            ) {
                return false
            }

            lng = i18nConfig.languages[i]
            return true
        })

        i18nConfig.languages.some(domainPostfix => {
            if (domain.startsWith(`${domainPostfix}.`)) {
                lng = domainPostfix
                return true
            }

            return false
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
