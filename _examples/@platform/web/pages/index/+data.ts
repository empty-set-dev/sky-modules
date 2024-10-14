'use server'
import { InitPageParams, InitPageResult } from 'renderer/initPage'
import data from 'sky/@platform/web/data'

export default data(init, {
    ns: ['common'],
})

async function init({ lng }: InitPageParams): Promise<InitPageResult<{ x: string }>> {
    const t = (await import(`#/locales/${lng}/common.js`)).default

    await idle(Time(1000, milliseconds))

    return {
        title: t.title,
        description: '',

        data: {
            x: Math.random().toFixed(2),
        },
    }
}
