// https://vike.dev/onPageTransitionStart
import '#/imports'

export { onPageTransitionStart }

import type { OnPageTransitionStartAsync } from 'vike/types'

const onPageTransitionStart: OnPageTransitionStartAsync =
    async (): ReturnType<OnPageTransitionStartAsync> => {
        document.querySelector('body')!.classList.add('page-is-transitioning')
    }
