// https://vike.dev/onPageTransitionEnd
import '#/imports'

export { onPageTransitionEnd }

import type { OnPageTransitionEndAsync } from 'vike/types'

const onPageTransitionEnd: OnPageTransitionEndAsync =
    async (): ReturnType<OnPageTransitionEndAsync> => {
        document.querySelector('body')!.classList.remove('page-is-transitioning')
    }
