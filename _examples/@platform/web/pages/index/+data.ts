import { InitPageParams, InitPageResult } from 'renderer/initPage'
import data from 'sky/@platform/web/data'

import { onInitHomePage } from './HomePage.telefunc'

export default data(init, {
    ns: ['common'],
})

async function init({
    t,
}: InitPageParams): Promise<InitPageResult<{ x: string; result: unknown }>> {
    await idle(Time(1000, milliseconds))

    const result = await onInitHomePage('somesome')

    return {
        title: t`title`,
        description: '',

        data: {
            x: Math.random().toFixed(2),
            result,
        },
    }
}
