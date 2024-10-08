// https://vike.dev/onPageTransitionStart
import '_examples/cameras/SkyPerspectiveCamera/imports'

export { onPageTransitionStart }

import type { OnPageTransitionStartAsync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartAsync =
    async (): ReturnType<OnPageTransitionStartAsync> => {
        document.querySelector('body')!.classList.add('page-is-transitioning')
    }
