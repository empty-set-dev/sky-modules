import data from 'sky/platform/web/data'
import getStore from 'sky/platform/web/helpers/getStore'

import { CounterStore } from '#/Store'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    const couterStore = getStore(pageContext, CounterStore)
    couterStore.counter = 10

    return {
        title: t`title`,
        description: '',
    }
})

export default HomePageData
