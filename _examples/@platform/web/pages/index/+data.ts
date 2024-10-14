'use server'
import data, { InitParams, InitResult } from 'sky/@platform/web/data'

export default data(init, {
    ns: ['common'],
})

export async function init({ lng }: InitParams): Promise<InitResult> {
    const t = (await import(`#/locales/${lng}/common.js`)).default

    await idle(Time(1000, milliseconds))

    return {
        title: t.title,
        description: '',
    }
}
