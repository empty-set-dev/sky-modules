import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'

import isIOS from './isIOS'

let scrollPosition = 0
let html: HTMLHtmlElement

if (!runsOnServerSide) {
    html = document.getElementsByTagName('html')[0]
}

const scrollLock = {
    enable(): void {
        scrollTo({
            top: 0,
            behavior: 'instant',
        })

        async(async () => {
            await switch_thread()
            const scrollBarCompensation = window.innerWidth - document.body.offsetWidth
            html.style.overflow = 'hidden'
            html.style.paddingRight = `${scrollBarCompensation}px`

            if (isIOS()) {
                scrollPosition = window.scrollY
                html.style.position = 'fixed'
                html.style.top = `-${scrollPosition}px`
                html.style.width = '100%'
            }
        })
    },

    disable(): void {
        html.style.removeProperty('overflow')
        html.style.removeProperty('padding-right')

        if (isIOS()) {
            html.style.removeProperty('position')
            html.style.removeProperty('top')
            html.style.removeProperty('width')
            window.scrollTo(0, scrollPosition)
        }
    },
}

export default scrollLock
