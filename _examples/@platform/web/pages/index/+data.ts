import { InitPageParams, InitPageResult } from 'renderer/initPage'
import data from 'sky/@platform/web/data'

import load from './load.server'

export default data(init, {
    ns: ['common'],
})

async function init({
    lng,
}: InitPageParams): Promise<InitPageResult<{ x: string; result: unknown }>> {
    const t = (await import(`#/locales/${lng}/common.js`)).default

    await idle(Time(1000, milliseconds))

    //const result = await load()

    return {
        title: t.title,
        description: '',

        data: {
            x: Math.random().toFixed(2),
            result: '123',
        },
    }
}
