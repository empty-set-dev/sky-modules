import isIOS from './isIOS'

let scrollPosition = 0

const scrollLock = {
    enable(): void {
        scrollTo({
            top: 0,
            behavior: 'instant',
        })

        setTimeout(() => {
            const $html = document.getElementsByTagName('html')[0]
            const scrollBarCompensation = window.innerWidth - document.body.offsetWidth
            $html.style.overflow = 'hidden'
            $html.style.paddingRight = `${scrollBarCompensation}px`

            if (isIOS()) {
                scrollPosition = window.scrollY
                $html.style.position = 'fixed'
                $html.style.top = `-${scrollPosition}px`
                $html.style.width = '100%'
            }
        }, 0)
    },

    disable(): void {
        const $html = document.getElementsByTagName('html')[0]

        $html.style.removeProperty('overflow')
        $html.style.removeProperty('padding-right')

        if (isIOS()) {
            $html.style.removeProperty('position')
            $html.style.removeProperty('top')
            $html.style.removeProperty('width')
            window.scrollTo(0, scrollPosition)
        }
    },
}

export default scrollLock
