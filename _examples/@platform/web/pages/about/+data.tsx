import data from 'sky/@platform/web/data'

import { InitPageResult } from '#/renderer/initPage'

export default data(init, {
    ns: [],
})

async function init(): Promise<InitPageResult> {
    return {
        title: 'About',
        description: '',
    }
}
