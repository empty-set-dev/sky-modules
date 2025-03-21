import data from 'sky/platform/web/data'
import getStore from 'sky/platform/web/helpers/getStore'

import { CounterStore } from '#/stores/CounterStore'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    const { setCounter } = getStore(pageContext, CounterStore)
    setCounter(10)

    return {
        title: t`title`,
        description: '',
    }
})

export default HomePageData
