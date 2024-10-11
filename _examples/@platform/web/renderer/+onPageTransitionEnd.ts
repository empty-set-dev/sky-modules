// https://vike.dev/onPageTransitionEnd
import '_examples/cameras/SkyPerspectiveCamera/imports'

export { onPageTransitionEnd }

import type { OnPageTransitionEndAsync } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEndAsync =
    async (): ReturnType<OnPageTransitionEndAsync> => {
        document.querySelector('body')!.classList.remove('page-is-transitioning')
    }
