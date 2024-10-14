import { DependencyList, useEffect } from 'react'

import { InitPageParams, InitPageResult } from './initPage'

/** https://vike.dev/useData */
export default function useData<Data>(
    handler: {
        init: (params: InitPageParams) => Promise<InitPageResult>
    },
    deps: DependencyList
): void {
    useEffect(() => {
        if (afterHydration) {
            return
        }

        handler.init({})
    }, deps)
}
